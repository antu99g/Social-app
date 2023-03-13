import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthProvider";

// Custom hook to provide authentication (using context api)
export const useAuth = () => {
   return useContext(AuthContext);
};

// Custom hook for editing with input
export const useHandleInput = (initialValue) => {
   const [value, setValue] = useState(initialValue || '');

   const handleChange = (value) => {
      setValue(value);
   };

   return {value, handleChange};
}

// Custom hook for editing and showing inputs
export const useEditField = (initialValue) => {
   const [showInput, setShowInput] = useState(false);
   const field = useHandleInput(initialValue);
   const value = field.value;
   const handleChange = field.handleChange;

   const toggleInput = (value) => {
      if (typeof value === "boolean") {
         setShowInput(value);
      } else {
         setShowInput(!showInput);
      }
   };

   return { showInput, value, handleChange, toggleInput };
};

// Custom hook to hide and show a component
export const useToggleView = (initialvalue) => {
   const [view, setView] = useState(false);

   const toggleView = (value) => {
      if (typeof value === 'boolean') {
         setView(value);
      } else {
         setView(!view);
      }
   };
   
   return { view, toggleView };
}

export function useForceUpdate() {
   const [value, setValue] = useState(0);
   return () => setValue((value) => value + 1);
}