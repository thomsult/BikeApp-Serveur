import type { AnyFieldApi } from "@tanstack/react-form";


export const FormField = ({
  label,
  children,
  required = false,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) => {
  return (
    <div className="flex-1 ">
      <p
        className="mb-2 text-sm font-medium"
      >
        {label}
        <span className="text-red-600">{required && " *"}</span>
      </p>
      {children}
    </div>
  );
};

export const DisplayError = ({ field }: { field: AnyFieldApi }) => {
  if (field.state.meta.isValid) return null;
  return (
    <p className="mt-1 text-sm text-red-500">
      {field.state.meta.errors.join(", ")}
    </p>
  );
};
