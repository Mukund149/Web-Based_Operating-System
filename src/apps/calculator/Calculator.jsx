import React, { useEffect, useState } from 'react'
import '../calculator/calculator.css'
import useWindowStore from '../../store/windowStore.js'

const Calculator = () => {

  const windows = useWindowStore(state => state.windows);
  const myWindow = windows.find(win => win.name === "Calculator");
  const isFocused = myWindow?.isFocused;

  const isValidKey = (key) => {
    if ((key >= "0" && key <= "9") || ["+", "-", "*", "/", "Enter", "Backspace"].includes(key)) {
      return true
    }
    return false
  }

  const [operation, setOperation] = useState("")
  const operators = ["/", "*", "-", "+"];
  const keyMap = {
    "0": "num-0",
    "1": "num-1",
    "2": "num-2",
    "3": "num-3",
    "4": "num-4",
    "5": "num-5",
    "6": "num-6",
    "7": "num-7",
    "8": "num-8",
    "9": "num-9",
    "/": "divide",
    "*": "multiply",
    "+": "plus",
    "-": "minus",
    "Enter": "enter",
    "Backspace": "backspace"
  }

  const handleInput = (key) => {
    if (key === "Backspace") {
      setOperation(prev => prev.slice(0, -1))
    }
    else if (key === "Enter") {
      setOperation(prev => {
        try {
          return eval(prev).toString();
        } catch {
          return "Error";
        }
      })
    }
    else {
      if (operation === "" && operators.includes(key)) {
        return
      }
      const lastChar = operation.slice(-1)
      if (operators.includes(lastChar) && operators.includes(key)) {
        setOperation(prev => prev.slice(0, -1) + key)
      } else {
        setOperation(prev => prev + key)
      }
    }
  }


  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isFocused) return
      const key = e.key;
      if (!isValidKey(key)) return
      handleInput(key)

      const buttonId = keyMap[key] || key;
      const btn = document.querySelector(`#${buttonId}`)
      if (btn) {
        btn.classList.add("pressed");
        setTimeout(() => {
          btn.classList.remove("pressed")
        }, 100);
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isFocused][operation])



  return (
    <div className='calc'>
      <div className="calc-screen">
        <input readOnly value={operation}></input>
      </div>
      <div className="operands">
        {[
          '1', '2', '3', '/', '4', '5', '6', '*', '7', '8', '9', '-', 'CE', '0', '=', '+'
        ].map((btn, i) => (
          <button
            key={i}
            id={`${keyMap[btn]}`}
            className={`cursor-target  ${operators.includes(btn) ? "operators" : `${btn === 'CE' ? "CE" : `${btn === "=" ? "enter" : "numbers"}`}`}`}
            onClick={() => {
              if (btn === 'CE') {
                setOperation('')
              } else if (btn === '=') {
                handleInput('Enter')
              } else {
                handleInput(btn)
              }
            }}
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Calculator
