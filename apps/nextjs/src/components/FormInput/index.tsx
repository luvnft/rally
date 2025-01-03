import type { InputProps } from 'react-html-props'
import { input } from './styles'
import type { SystemUiInputProps } from './styles'
interface FormInputProps extends InputProps, SystemUiInputProps {
  hasError: boolean
}

export const FormInput = (props: FormInputProps) => {
  const { className, hasError, scale, appearance, ...rest } = props
  //@ts-ignore
  return (
    <input
      className={input({
        appearance: appearance ?? 'square',
        scale: scale ?? 'default',
        //@ts-ignore
        variant: hasError === true ? 'error' : 'default',
        //@ts-ignore
        class: className ?? '',
      })}
      {...rest}
    />
  )
}

export default FormInput
