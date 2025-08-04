import React from 'react';

type CardProps = {
  children: React.ReactNode;
};

type CardHeaderProps = {
  children: React.ReactNode;
};

type CardTitleProps = {
  children: React.ReactNode;
};

type CardContentProps = {
  children: React.ReactNode;
};

const Card: React.FC<CardProps> = ({ children }) => {
  return <div className="border rounded-md shadow-sm bg-white">{children}</div>;
};

const CardHeader: React.FC<CardHeaderProps> = ({ children }) => {
  return <div className="p-4 border-b">{children}</div>;
};

const CardTitle: React.FC<CardTitleProps> = ({ children }) => {
  return <h2 className="text-xl font-bold">{children}</h2>;
};

const CardContent: React.FC<CardContentProps> = ({ children }) => {
  return <div className="p-4">{children}</div>;
};

export { Card, CardHeader, CardTitle, CardContent };