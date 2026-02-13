import { createContext, useContext, useState } from 'react';
import type { ReactNode, ButtonHTMLAttributes, HTMLAttributes } from 'react';

interface TabsContextValue {
  value: string;
  setValue: (next: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

interface TabsProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
}

export function Tabs({
  value,
  defaultValue,
  onValueChange,
  children,
  className,
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? '');
  const current = value ?? internalValue;

  const handleChange = (next: string) => {
    if (value === undefined) {
      setInternalValue(next);
    }
    onValueChange?.(next);
  };

  return (
    <TabsContext.Provider value={{ value: current, setValue: handleChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList(props: HTMLAttributes<HTMLDivElement>) {
  return <div role="tablist" {...props} />;
}

interface TabsTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  activeClassName?: string;
}

export function TabsTrigger({
  value,
  activeClassName,
  className,
  ...rest
}: TabsTriggerProps) {
  const ctx = useContext(TabsContext);
  if (!ctx) {
    throw new Error('TabsTrigger must be used within <Tabs>');
  }
  const isActive = ctx.value === value;
  const mergedClassName = `${className ?? ''}${
    isActive && activeClassName ? ` ${activeClassName}` : ''
  }`.trim();

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      className={mergedClassName}
      onClick={() => ctx.setValue(value)}
      {...rest}
    />
  );
}

interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
}

export function TabsContent({ value, hidden, ...rest }: TabsContentProps) {
  const ctx = useContext(TabsContext);
  if (!ctx) {
    throw new Error('TabsContent must be used within <Tabs>');
  }
  const isActive = ctx.value === value;

  return (
    <div
      role="tabpanel"
      hidden={hidden ?? !isActive}
      aria-hidden={!isActive}
      {...rest}
    />
  );
}

