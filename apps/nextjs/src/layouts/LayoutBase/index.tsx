import { useAccount } from 'wagmi'
import { ProviderLiveVoiceChat } from '@hooks/useVoiceChat/Provider'
import MobileTopMenu from './MobileTopMenu'
import MainNavBar from './MainNavBar'
import BannerConnectWallet from './BannerConnectWallet'
import BannerSignInWithLens from './BannerSignInWithLens'
import ToolbarAudioRoom from './ToolbarAudioRoom'
import { useStoreLiveVoiceChat } from '@hooks/useVoiceChat'
import DialogModalListParticipantsWithRaisedHands from '@components/pages/rally/[idRally]/DialogModalListParticipantsWithRaisedHands'
import useWalletAddressDefaultLensProfile from '@hooks/useWalletAddressDefaultLensProfile'
import { useStoreHasSignedInWithLens } from '@hooks/useSignInWithLens'
import DialogModalStageGuide from '@components/pages/rally/[idRally]/DialogModalStageGuide'
import dynamic from 'next/dynamic'
import useAudioPlayer from '@hooks/usePersistedAudioPlayer'
import { useSession } from 'next-auth/react'
import { useUpdateEffect } from '@react-hookz/web'
import Cookies from 'js-cookie'
import { COOKIE_LENS_ACCESS_TOKEN, COOKIE_LENS_REFRESH_TOKEN } from '@config/storage'
import { MediaProvider } from '@vidstack/react'

const NoSSRToolbarAudioPlayer = dynamic(() => import('./ToolbarAudioPlayer'), {
  ssr: false,
})

// The feature below will be disabled until the `updateRoomMetadata` feature is fixed on Livekit server
// import DialogModalPinItem from '@components/pages/rally/[idRally]/DialogModalPinItem'
interface LayoutProps {
  children: React.ReactNode
}

export const LayoutBase = (props: LayoutProps) => {
  const { children } = props
  const isSignedIn = useStoreHasSignedInWithLens((state) => state.isSignedIn)
  const setIsSignedIn = useStoreHasSignedInWithLens((state) => state.setIsSignedIn)

  const session = useSession()
  const stateVoiceChat: any = useStoreLiveVoiceChat()
  const { address, isConnecting } = useAccount({
    async onDisconnect() {
      await stateVoiceChat?.room?.disconnect()
      setIsSignedIn(false)
    },
  })

  const queryCurrentUserLensProfile = useWalletAddressDefaultLensProfile(address as `0x${string}`, {
    enabled: address ? true : false,
  })
  const isPlayerOpen = useAudioPlayer((state) => state.isOpen)
  const isPlayerReady = useAudioPlayer((state) => state.isReady)

  useUpdateEffect(() => {
    if (!session?.data?.user?.name || session?.data?.user?.name !== address) {
      setIsSignedIn(false)
      Cookies.remove(COOKIE_LENS_ACCESS_TOKEN)
      Cookies.remove(COOKIE_LENS_REFRESH_TOKEN)

      if (stateVoiceChat?.room?.state === 'connected' && stateVoiceChat?.room?.sid !== '')
        stateVoiceChat.room.disconnect()
    }
  }, [session?.data?.user?.name, address])
  return (
    <div className="relative flex-grow flex flex-col">
      {!isConnecting && !address && <BannerConnectWallet />}
      {address && !isSignedIn && <BannerSignInWithLens />}
      <div className="flex-grow pb-12 md:pb-0 flex flex-col md:grid md:grid-cols-12">
        <MainNavBar address={address} />
        <MobileTopMenu address={address} />
        <div
          className={`pt-5  ${
            ((stateVoiceChat?.room?.state === 'connected' || isPlayerReady) &&
              !isSignedIn &&
              queryCurrentUserLensProfile?.data?.handle) ||
            isPlayerReady
              ? 'pb-64'
              : stateVoiceChat?.room?.state === 'connected'
              ? 'pb-48'
              : 'pb-32'
          } md:border-x flex flex-col md:border-neutral-4 md:border-solid md:col-span-8 px-3 md:px-6 flex-grow`}
        >
          <p className="w-full text-center text-[0.775rem] pb-8 text-neutral-9">
            Rally is under heavy development. Bugs may occur - proceed with caution ! <br />
            Rally uses WebRTC. Make sure your browser supports this to use Rally !
            <br />
            For the best experience on mobile, we recommend using Brave.
          </p>
          {children}
        </div>
        <div
          className={`transition-all ${
            isPlayerReady === true ? 'z-30 translate-y-0' : 'z-[-1] translate-y-full'
          } fixed bottom-12 md:bottom-0 w-full`}
        >
          <div className="transition-all pointer-events-auto min-h-[6.895rem] border-transparent flex pb-1 pt-2 bg-neutral-1 md:bg-black border-y-neutral-4 border">
            {isPlayerOpen && (
              <MediaProvider>
                <NoSSRToolbarAudioPlayer />
              </MediaProvider>
            )}
          </div>
        </div>
        <div
          className={`transition-all ${
            stateVoiceChat?.room?.localParticipant ? 'z-30 translate-y-0' : 'z-[-1] translate-y-full'
          } fixed bottom-12 md:bottom-0 w-full pointer-events-none`}
        >
          {stateVoiceChat?.room?.sid !== '' && stateVoiceChat?.room?.state !== 'disconnected' && (
            <div
              className={`grid md:grid-cols-12 px-3 lg:px-6 pointer-events-none ${
                !isSignedIn ? 'mb-3 md:mb-32' : 'mb-3'
              }`}
            >
              <div className="flex flex-col md:col-start-2 lg:col-start-3 md:col-end-10 lg:col-end-11 w-fit-content mis-auto items-end space-y-3 ">
                <DialogModalStageGuide />
                {stateVoiceChat?.room?.localParticipant?.permissions?.canPublishData === true && (
                  <>
                    <DialogModalListParticipantsWithRaisedHands />
                    {/* <DialogModalPinItem /> */}
                  </>
                )}
              </div>
            </div>
          )}
          {stateVoiceChat?.room?.state === 'connected' && stateVoiceChat?.room?.sid !== '' && (
            <div
              className={`transition-all pointer-events-auto border-transparent flex pt-1 bg-neutral-1 md:bg-black border-y-neutral-4 border`}
            >
              <ToolbarAudioRoom />
            </div>
          )}
        </div>
        <div className="hidden md:block md:col-span-1 lg:col-span-2 md:pis-6 pb-6">
          <footer className="flex flex-col md:pt-6 space-y-3 text-2xs text-neutral-11">
            <a target="_blank" rel="noreferrer noopener" href="https://twitter.com/rallydotfm">
              Twitter
            </a>
            <a target="_blank" rel="noreferrer noopener" href="https://github.com/rallydotfm/rally/">
              Github
            </a>
          </footer>
        </div>
      </div>
    </div>
  )
}

export const getLayout = (page: any) => {
  return (
    <ProviderLiveVoiceChat>
      <LayoutBase>{page}</LayoutBase>
    </ProviderLiveVoiceChat>
  )
}
export default LayoutBase
