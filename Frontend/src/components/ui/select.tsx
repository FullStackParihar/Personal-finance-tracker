import React from 'react';

type SelectProps = {
  children: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  name?: string;
  value?: string;
};

type SelectItemProps = {
  value: string;
  children: React.ReactNode;
};

type SelectValueProps = {
  placeholder?: string;
};

const Select: React.FC<SelectProps> = ({ children, onChange, name, value }) => {
  return (
    <select
      className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      onChange={onChange}
      name={name}
      value={value}
    >
      {children}
    </select>
  );
};

const SelectItem: React.FC<SelectItemProps> = ({ value, children }) => {
  return <option value={value}>{children}</option>;
};

const SelectValue: React.FC<SelectValueProps> = ({ placeholder }) => {
  return (
    <option value="" disabled hidden>
      {placeholder}
    </option>
  );
};

export { Select, SelectItem, SelectValue };
