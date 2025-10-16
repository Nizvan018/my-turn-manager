import { Controller, type Control, type FieldError, type FieldValues, type Path } from "react-hook-form";

/** Component props */
interface Props<T extends FieldValues, F extends FieldValues> {
    /** Name of the field */
    name: Path<T>;
    /** Control of the field */
    control: Control<T, unknown, F>;
    /** Label of the field */
    label?: string;
    /** Placeholder of the field */
    placeholder?: string;
    /** Value type of the field */
    type?: React.HTMLInputTypeAttribute;
    /** Min value for number field */
    min?: number;
    /** Max value for number field */
    max?: number;
    /** Max length value of the field */
    maxLength?: number;
    /** Indicate whether the field is disabled or not */
    disabled?: boolean;
    /** Error of the field (if it exists) */
    error?: FieldError;
    /** Optional class name attribute */
    className?: React.ComponentProps<"div">["className"];
}

/**
 * This custom input can use a react-hook-form Controller for forms and validations
 * 
 * @param {Props} props - Component props 
 * @returns JSX.Element
 */
export default function CustomInput<
    T extends FieldValues, F extends FieldValues
>({
    name,
    control,
    label,
    placeholder,
    type = "text",
    min,
    max,
    maxLength,
    disabled,
    error,
    className
}: Props<T, F>) {
    return (
        <div className={`${className} ${disabled && "opacity-50"} flex flex-col gap-1 transition-opacity duration-200`}>
            <div className="flex flex-col gap-1 p-3 rounded-2xl border border-curious-blue-950/10 bg-curious-blue-950/5">
                <label
                    htmlFor={name}
                    className="text-sm text-curious-blue-950/60"
                >
                    {label}
                </label>
                <Controller
                    name={name}
                    control={control}
                    render={({ field }) => (
                        <input
                            id={name}
                            type={type}
                            {...field}
                            min={min}
                            max={max}
                            maxLength={maxLength}
                            disabled={disabled}
                            placeholder={placeholder}
                            className="outline-none font-medium placeholder:text-curious-blue-950/30"
                        />
                    )}
                />
            </div>
            <span className="h-[14px] text-sm text-rose-500">{error?.message ?? ""}</span>
        </div>
    )
}
