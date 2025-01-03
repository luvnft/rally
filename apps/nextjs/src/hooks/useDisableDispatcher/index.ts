import { useContractWrite, useSignTypedData } from 'wagmi'
import { polygonMumbai, polygon } from 'wagmi/chains'
import omit from '@helpers/omit'
import splitSignature from '@helpers/splitSignature'
import { CONTRACT_LENS_HUB_PROXY } from '@config/contracts'
import { lensHubProxyABI } from '@rally/abi'
import { API_URL } from '@config/lens'
import toast from 'react-hot-toast'
import disableDispatcherWithTypedData from '@services/lens/dispatcher/disable'
import { useQueryClient } from '@tanstack/react-query'
import { usePollTransaction } from '@hooks/usePollTransaction'

export function useDisableDispatcher(profile: { id: any; ownedBy: unknown }) {
  const queryClient = useQueryClient()
  const signTypedDataFollow = useSignTypedData()
  const contractWriteDisableDispatcher = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: CONTRACT_LENS_HUB_PROXY as `0x${string}`,
    abi: lensHubProxyABI,
    functionName: 'setDispatcherWithSig',
    //@ts-ignore
    chainId: API_URL.includes('mumbai') ? polygonMumbai.id : polygon.id,
    onError(err) {
      console.error(err.message)
    },
  })

  const mutationPollTransaction = usePollTransaction({
    messageSuccess: 'Dispatcher disabled successfully!',
    messageError: 'Something went wrong, please try again.',
    options: {},
  })

  async function disableDispatcher() {
    try {
      //@ts-ignore
      const result = await disableDispatcherWithTypedData({ profileId: profile.id, enable: false })

      if (result?.createSetDispatcherTypedData?.typedData) {
        const typedData = result.createSetDispatcherTypedData.typedData
        const signature = await signTypedDataFollow.signTypedDataAsync({
          domain: omit(typedData?.domain, '__typename'),
          //@ts-ignore
          types: omit(typedData?.types, '__typename'),
          //@ts-ignore
          value: omit(typedData?.value, '__typename'),
        })

        const { v, r, s } = splitSignature(signature)
        //@ts-ignore
        const tx = await contractWriteDisableDispatcher.writeAsync({
          recklesslySetUnpreparedArgs: [
            {
              profileId: typedData.value.profileId,
              dispatcher: typedData.value.dispatcher,
              sig: {
                v,
                r: r as `0x${string}`,
                s: s as `0x${string}`,
                deadline: typedData.value.deadline,
              },
            },
          ],
        })
        //@ts-ignore
        mutationPollTransaction.mutate(tx.hash)
        await queryClient.invalidateQueries({ queryKey: ['lens-profile-by-wallet-address', profile.ownedBy] })
      } else {
        //@ts-ignore
        toast.error(`Something went wrong: ${result?.error}`)
      }
    } catch (e) {
      console.error(e)
      //@ts-ignore
      toast.error(`Something went wrong: ${e?.cause ?? e}`)
    }
  }

  return {
    disableDispatcher,
    contractWriteDisableDispatcher,
    signTypedDataFollow,
    mutationPollTransaction,
  }
}

export default useDisableDispatcher
