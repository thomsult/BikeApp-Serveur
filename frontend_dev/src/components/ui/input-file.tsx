import { useState, useCallback, useRef, useEffect } from "react";
import { FieldError } from "./field";
import { Button } from "./button";
import { X } from "lucide-react";
import { Input } from "./input";
import { useForm, type AnyFieldApi, } from "@tanstack/react-form";
import { getUploadedFileUrl } from "@/lib/api/common";


// ─── InputFile ───────────────────────────────────────────────────────────────

type InputFileProps = {
  onChange?: (file: File) => void;
  accept?: string;
  placeholder?: string;
  invalid?: boolean;
  value?: File | string | null;
};

export const InputFile = ({
  onChange,
  accept = "image/*",
  placeholder = "https://placehold.co/600x400",
  invalid,
  value,
}: InputFileProps) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      onChange?.(file);

      const objectUrl = URL.createObjectURL(file);
      setPreview((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return objectUrl;
      });
    },
    [onChange]
  );



  useEffect(() => {
    if (value && typeof value !== "string") {
      const objectUrl = URL.createObjectURL(value);
      setPreview(objectUrl);
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    } else if (typeof value === "string") {
      getUploadedFileUrl("/" + value)
        .then((url) => setPreview(url))
        .catch(() => setPreview(null));

    } else {
      setPreview(null);
    }
  }, [value]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleImageClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handlePlaceholderClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleClearPreview = useCallback(() => {
    setPreview(null);
    onChange?.(null as any);
  }, [onChange]);

  return (
    <div className={
      `
    relative flex flex-col items-center gap-4  border border-dashed border-gray-300 rounded-md cursor-pointer hover:border-primary transition-colors
    ${invalid ? "border-destructive border-2 hover:border-2 hover:border-destructive " : ""}
    `
    }>
      <Input
        ref={inputRef as any}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        aria-invalid={!!invalid}
      />
      {
        preview && <><img
          src={preview}
          alt="Preview"
          className="h-48 w-full object-cover rounded-md"
          onClick={handleImageClick}
        />
          <Button
            variant="outline-destructive"
            className="absolute top-2 right-2 rounded-full"
            size="icon-xs"
            onClick={handleClearPreview}
          >
            <X className="size-4 " />
          </Button>

        </>
      }
      {
        !preview && (
          <div
            className="flex flex-col items-center gap-2 py-8"
            onClick={handlePlaceholderClick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l -3 3m3-3v12"
              />
            </svg>
            <p className="text-sm text-gray-500">{placeholder}</p>
          </div>
        )
      }
    </div >
  );
}

// ─── ControlledInputFile ─────────────────────────────────────────────────────
//
type ControlledInputFileProps = {
  Field: ReturnType<typeof useForm>["Field"] & any;
  id: string;
  accept?: string;
  placeholder?: string;
};
export const ControlledInputFile = ({
  id,
  Field,
  accept,
  placeholder,
}: ControlledInputFileProps) => {
  return (
    <Field name={id}>
      {(field: AnyFieldApi) => (
        <>
          <InputFile
            onChange={(file) => field.handleChange(file)}
            value={field.state.value}
            accept={accept}
            placeholder={placeholder}
            invalid={field.state.meta.errors?.length > 0}
          />
          {field.state.meta.errors?.length > 0 && (
            <FieldError errors={field.state.meta.errors} />
          )}
        </>
      )}
    </Field>
  );
};