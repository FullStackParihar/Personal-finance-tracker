import React from 'react';

type ButtonVariant = 'default' | 'destructive';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  className?: string;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  type = 'button',
  variant = 'default',
  onClick,
  className = '',
  ...rest
}) => {
  const baseStyles = 'px-4 py-2 rounded-md font-medium';
  const variantStyles =
    variant === 'destructive'
      ? 'bg-red-500 text-white hover:bg-red-600'
      : 'bg-blue-500 text-white hover:bg-blue-600';

  return (
    <button
      type={type}
      className={`${baseStyles} ${variantStyles} ${className}`}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
};

export { Button };
