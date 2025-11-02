import React, { useState, useCallback, useEffect } from 'react';
import { LOWERCASE_CHARS, UPPERCASE_CHARS, NUMBERS_CHARS, SYMBOLS_CHARS } from '../constants';
import { CheckIcon, CopyIcon, ShieldCheckIcon } from './Icons';

interface CheckboxOption {
  id: string;
  label: string;
  checked: boolean;
  setter: React.Dispatch<React.SetStateAction<boolean>>;
}

const PasswordGenerator: React.FC = () => {
  const [password, setPassword] = useState<string>('');
  const [passwordLength, setPasswordLength] = useState<number>(16);
  const [lengthInput, setLengthInput] = useState<string>('16');
  const [includeUppercase, setIncludeUppercase] = useState<boolean>(true);
  const [includeLowercase, setIncludeLowercase] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }, []);

  const generatePassword = useCallback(() => {
    let characterPool = '';
    if (includeUppercase) characterPool += UPPERCASE_CHARS;
    if (includeLowercase) characterPool += LOWERCASE_CHARS;
    if (includeNumbers) characterPool += NUMBERS_CHARS;
    if (includeSymbols) characterPool += SYMBOLS_CHARS;

    if (characterPool === '') {
      setPassword('Выберите хотя бы один набор символов');
      return;
    }

    const cryptoArray = new Uint32Array(passwordLength);
    window.crypto.getRandomValues(cryptoArray);

    let newPassword = '';
    for (let i = 0; i < passwordLength; i++) {
      newPassword += characterPool[cryptoArray[i] % characterPool.length];
    }
    setPassword(newPassword);
    setCopied(false);
    setTimeout(adjustTextareaHeight, 0);
  }, [passwordLength, includeUppercase, includeLowercase, includeNumbers, includeSymbols, adjustTextareaHeight]);

  useEffect(() => {
    generatePassword();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    adjustTextareaHeight();
  }, [password, adjustTextareaHeight]);

  const handleCopyToClipboard = useCallback(() => {
    if (!password || password.startsWith('Выберите')) return;
    navigator.clipboard.writeText(password).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [password]);

  const handleLengthInputChange = (value: string) => {
    setLengthInput(value);
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 128) {
      setPasswordLength(numValue);
    }
  };

  const handleLengthInputBlur = () => {
    const numValue = parseInt(lengthInput, 10);
    if (isNaN(numValue) || numValue < 1) {
      setPasswordLength(1);
      setLengthInput('1');
    } else if (numValue > 128) {
      setPasswordLength(128);
      setLengthInput('128');
    }
  };
  
  const checkboxOptions: CheckboxOption[] = [
    { id: 'uppercase', label: 'Заглавные буквы (A-Z)', checked: includeUppercase, setter: setIncludeUppercase },
    { id: 'lowercase', label: 'Строчные буквы (a-z)', checked: includeLowercase, setter: setIncludeLowercase },
    { id: 'numbers', label: 'Цифры (0-9)', checked: includeNumbers, setter: setIncludeNumbers },
    { id: 'symbols', label: 'Символы (!@#$%)', checked: includeSymbols, setter: setIncludeSymbols },
  ];

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-slate-900 text-slate-100 p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Генератор паролей</h1>
          <p className="text-slate-400 mt-2">Создавайте надежные и безопасные пароли</p>
        </div>

        <div className="bg-slate-800 rounded-lg shadow-xl p-6 sm:p-8 space-y-6">
          <div className="relative">
            <textarea
              ref={textareaRef}
              readOnly
              value={password}
              className="w-full bg-slate-700 text-slate-50 font-mono text-lg p-4 pr-12 rounded-md border-2 border-transparent focus:border-cyan-500 focus:ring-cyan-500 transition resize-none overflow-hidden break-all"
              placeholder="Ваш пароль появится здесь"
              rows={1}
              style={{
                minHeight: '56px',
                height: 'auto',
                lineHeight: '1.5'
              }}
            />
            <button
              onClick={handleCopyToClipboard}
              className="absolute top-2 right-2 flex items-center justify-center w-10 h-10 text-slate-400 hover:text-cyan-400 transition-colors rounded-md hover:bg-slate-600/50"
              aria-label="Копировать пароль"
            >
              {copied ? <CheckIcon className="w-6 h-6 text-green-400" /> : <CopyIcon className="w-6 h-6" />}
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <label htmlFor="length" className="text-slate-300 whitespace-nowrap">Длина пароля</label>
              <input
                type="number"
                min="1"
                max="128"
                value={lengthInput}
                onChange={(e) => handleLengthInputChange(e.target.value)}
                onBlur={handleLengthInputBlur}
                className="w-20 font-mono text-cyan-400 text-lg bg-slate-700 px-3 py-1 rounded-md border-2 border-transparent focus:border-cyan-500 focus:ring-cyan-500 transition text-center"
              />
            </div>
            <input
              type="range"
              id="length"
              min="1"
              max="128"
              value={passwordLength}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setPasswordLength(val);
                setLengthInput(val.toString());
              }}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {checkboxOptions.map((option) => (
              <div key={option.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={option.id}
                  checked={option.checked}
                  onChange={(e) => option.setter(e.target.checked)}
                  className="w-5 h-5 accent-cyan-500 bg-slate-700 border-slate-600 rounded text-cyan-500 focus:ring-cyan-600"
                />
                <label htmlFor={option.id} className="ml-3 text-sm text-slate-300 select-none cursor-pointer">
                  {option.label}
                </label>
              </div>
            ))}
          </div>

          <button
            onClick={generatePassword}
            className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-md transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-75"
          >
            <ShieldCheckIcon className="w-6 h-6" />
            Сгенерировать пароль
          </button>
        </div>
      </div>
    </main>
  );
};

export default PasswordGenerator;