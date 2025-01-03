import { IconSpinner } from '@components/Icons'
import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/20/solid'
interface DeploymentStepProps {
  isSuccess: boolean
  isLoading: boolean
  isError: boolean
  children: React.ReactNode
}
export const DeploymentStep = (props: DeploymentStepProps) => {
  const { isLoading, isSuccess, isError, children } = props
  return (
    <>
      {isSuccess && <CheckCircleIcon className="w-5 shrink-0 text-positive-11" />}
      {isError && <ExclamationTriangleIcon className="w-5 shrink-0 text-negative-10" />}
      {isLoading && <IconSpinner className="animate-spin shrink-0" />}
      <span className={`pis-1ex shrink-O ${isLoading ? 'animate-pulse' : ''}`}>{children}</span>
    </>
  )
}

export default DeploymentStep
