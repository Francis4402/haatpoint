import { jsx } from "react/jsx-runtime";
import { forwardRef, useRef, useImperativeHandle, useEffect } from "react";
function InputError({
  message,
  className = "",
  ...props
}) {
  return message ? /* @__PURE__ */ jsx(
    "p",
    {
      ...props,
      className: "text-sm text-red-600 " + className,
      children: message
    }
  ) : null;
}
function PrimaryButton({
  className = "",
  disabled,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "button",
    {
      ...props,
      className: `inline-flex items-center rounded-md border border-transparent bg-gray-800 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-gray-700 focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-gray-900 ${disabled && "opacity-25"} ` + className,
      disabled,
      children
    }
  );
}
const TextInput = forwardRef(function TextInput2({
  type = "text",
  className = "",
  isFocused = false,
  ...props
}, ref) {
  const localRef = useRef(null);
  useImperativeHandle(ref, () => ({
    focus: () => localRef.current?.focus()
  }));
  useEffect(() => {
    if (isFocused) {
      localRef.current?.focus();
    }
  }, [isFocused]);
  return /* @__PURE__ */ jsx(
    "input",
    {
      ...props,
      type,
      className: "rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 " + className,
      ref: localRef
    }
  );
});
export {
  InputError as I,
  PrimaryButton as P,
  TextInput as T
};
