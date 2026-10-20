import styled from "styled-components";
import { Sun, Moon } from "lucide-react";

type ToggleSwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export default function ToggleSwitch({
  checked,
  onChange,
}: ToggleSwitchProps) {
  return (
    <StyledLabel $checked={checked}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        aria-label="Toggle dark mode"
      />
      {/* icons */}
      <Sun className="sun-icon" size={16} />
      <Moon className="moon-icon" size={16} />

      <span className="slider" />
    </StyledLabel>
  );
}

const StyledLabel = styled.label<{ $checked: boolean }>`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 30px;
  flex-shrink: 0;
  cursor: pointer;

  input {
    position: absolute;
    width: 1px;
    height: 1px;
    opacity: 0;
  }

  .sun-icon,
  .moon-icon {
    position: absolute;
    top: 7px;
    z-index: 1;
    pointer-events: none;
  }

  .sun-icon {
    left: 7px;
    color: #ca8516;
  }

  .moon-icon {
    right: 7px;
    color: #8b8b8b;
  }

  .slider {
    position: absolute;
    inset: 0;
    border-radius: 30px;
    background: ${({ $checked }) =>
      $checked ? "#38334f" : "#f5dfad"};
    transition: background 0.3s;
  }

  .slider::before {
    content: "";
    position: absolute;
    width: 24px;
    height: 24px;
    left: 3px;
    top: 3px;
    border-radius: 50%;
    background: white;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
    transform: ${({ $checked }) =>
      $checked ? "translateX(30px)" : "translateX(0)"};
    transition: transform 0.3s;
  }

  input:focus-visible + .sun-icon {
    outline: 2px solid #cba984;
  }
`;