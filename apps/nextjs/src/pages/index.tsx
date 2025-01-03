import button from '@components/Button/styles'
import { IconSpinner } from '@components/Icons'
import { ListFilteredRallies } from '@components/pages/home/ListFilteredRallies'
import { ROUTE_PREFERENCES_BROWSING, ROUTE_PROFILE, ROUTE_RALLY_NEW, ROUTE_SEARCH_RALLIES } from '@config/routes'
import { ArrowRightIcon } from '@heroicons/react/20/solid'
import useGetHomeAudioChatsSelection from '@hooks/useGetHomeAudioChatsSelection'
import { useStorePersistedInterests } from '@hooks/usePersistedInterests'
import useWalletAddressDefaultLensProfile from '@hooks/useWalletAddressDefaultLensProfile'
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import Link from 'next/link'
import { useAccount } from 'wagmi'
import LensPublicationContent from '@components/LensPublicationContent'
import { formatRelative } from 'date-fns'

const Page: NextPage = () => {
  const account = useAccount()
  const session = useSession()
  const interests = useStorePersistedInterests((state: any) => state.interests)
  const queryLensProfile = useWalletAddressDefaultLensProfile(account?.address as `0x${string}`, {
    enabled: account?.address ? true : false,
  })
  const {
    //  queryGetLatestPosts,
    queryAudioChatsHappeningLater,
    queryAudioChatsHappeningNow,
    queryAudioChatsHappeningSoon,
  } = useGetHomeAudioChatsSelection()

  return (
    <>
      <Head>
        <title>Rally - Open-source drop-in audio for web3 communities</title>
        <meta
          name="description"
          content="Rally is an open-source alternative to Twitter Space/Clubhouse for web3 communities."
        />
      </Head>
      <>
        <div className="-mx-3 md:-mx-6 px-3 md:px-6 pb-6  border-b border-neutral-4">
          {queryLensProfile?.isSuccess && (
            <>
              {queryLensProfile?.data?.interests?.length === 0 ||
                (queryLensProfile?.data === null &&
                  (interests?.[account?.address as `0x${string}`]?.length === 0 ||
                    !interests?.[account?.address as `0x${string}`]) && (
                    <aside className="border flex flex-wrap gap-3 items-center justify-between border-neutral-4 p-4 text-2xs text-white font-semibold rounded-md animate-appear mb-12">
                      <p>Want to see more content that match your interests ?</p>
                      <Link
                        className={button({
                          intent: 'primary-outline',
                          scale: 'xs',
                        })}
                        href={ROUTE_PREFERENCES_BROWSING}
                      >
                        Setup profile interests
                      </Link>
                    </aside>
                  ))}
            </>
          )}
        </div>
        <main className="pt-8">
          {/* @ts-ignore */}
          {!session?.data?.address && (
            <div className="animate-appear pb-24 text-center mx-auto md:max-w-3/4">
              <h1 className="text-xl font-semibold">
                <span className="font-black">Tune-in ! </span>
                <br />
                <span className="text-2xl">Your friends, followers and favourite creators are already on Rally.</span>
              </h1>
              <p className="pt-4 font-medium text-neutral-12 text-opacity-75 ">
                Rally is an open-source alternative to Twitter Space and Clubhouse. Just connect your wallet and pick a
                room to drop-in and listen what's up.
              </p>
            </div>
          )}
          <div className="grid grid-cols-1 gap-6 animate-appear">
            <section className="pb-8 border-b border-neutral-4">
              <h2 className="text-md font-bold">🔴🗣️ Happening now</h2>
              {queryAudioChatsHappeningNow?.isLoading && (
                <div className="mb-6 pt-12 animate-appear flex items-center justify-center space-i-1ex">
                  <IconSpinner className="text-lg animate-spin" />
                  <p className="font-bold animate-pulse">Loading rallies...</p>
                </div>
              )}
              {queryAudioChatsHappeningNow?.data && (
                <>
                  {queryAudioChatsHappeningNow?.data?.length === 0 ? (
                    <>
                      <section className="max-w-[22rem] mt-6 p-6 bg-neutral-1 rounded-lg animate-appear w-full">
                        <p className="text-xs text-neutral-11 mb-3">
                          It seems there's currently no rally happening now that matches your interests.
                        </p>

                        <Link className="text-2xs link" href={ROUTE_SEARCH_RALLIES}>
                          Browse all rallies happening now
                        </Link>
                      </section>
                    </>
                  ) : (
                    <div className="gap-2 flex flex-col mt-4">
                      <ListFilteredRallies
                        skip={0}
                        perPage={8}
                        isLoading={queryAudioChatsHappeningNow?.isLoading}
                        isError={queryAudioChatsHappeningNow?.isError}
                        list={queryAudioChatsHappeningNow?.data}
                        setSkip={() => null}
                      />

                      <Link
                        className="text-2xs flex items-center font-semibold text-neutral-12"
                        href={ROUTE_SEARCH_RALLIES}
                      >
                        Browse more rallies happening now
                        <ArrowRightIcon className="w-4 mis-2" />
                      </Link>
                    </div>
                  )}
                </>
              )}
            </section>
            <section className="pb-8 border-b border-neutral-4">
              <h2 className="text-md font-bold">👀 Starting soon</h2>
              {queryAudioChatsHappeningSoon?.isLoading && (
                <div className="mb-6 pt-12 animate-appear flex items-center justify-center space-i-1ex">
                  <IconSpinner className="text-lg animate-spin" />
                  <p className="font-bold animate-pulse">Loading rallies...</p>
                </div>
              )}
              {queryAudioChatsHappeningSoon?.data && (
                <>
                  {queryAudioChatsHappeningSoon?.data?.length === 0 ? (
                    <>
                      <section className="max-w-[22rem] mt-6 p-6 bg-neutral-1 rounded-lg animate-appear w-full">
                        <p className="text-xs text-neutral-11 mb-3">
                          It seems there's currently no rally happening soon that matches your interests.
                        </p>

                        <Link className="text-2xs link" href={ROUTE_SEARCH_RALLIES}>
                          Browse all rallies happening soon
                        </Link>
                      </section>
                    </>
                  ) : (
                    <div className="gap-2 flex flex-col mt-4">
                      <ListFilteredRallies
                        skip={0}
                        perPage={8}
                        isLoading={queryAudioChatsHappeningSoon?.isLoading}
                        isError={queryAudioChatsHappeningSoon?.isError}
                        list={queryAudioChatsHappeningSoon?.data}
                        setSkip={() => console.log('')}
                      />
                      <Link
                        className="px-3 text-2xs font-semibold text-neutral-12 flex items-center"
                        href={ROUTE_SEARCH_RALLIES}
                      >
                        Browse more rallies happening soon
                        <ArrowRightIcon className="w-4 mis-2" />
                      </Link>
                    </div>
                  )}
                </>
              )}
            </section>

            <section className="pb-8 border-b border-neutral-4">
              <h2 className="text-md font-bold">⌛ Later today</h2>
              {queryAudioChatsHappeningLater?.isLoading && (
                <div className="mb-6 pt-12 animate-appear flex items-center justify-center space-i-1ex">
                  <IconSpinner className="text-lg animate-spin" />
                  <p className="font-bold animate-pulse">Loading rallies...</p>
                </div>
              )}
              {queryAudioChatsHappeningLater?.data && (
                <>
                  {queryAudioChatsHappeningLater?.data?.length === 0 ? (
                    <>
                      <section className="max-w-[22rem] mt-6 p-6 bg-neutral-1 rounded-lg animate-appear w-full">
                        <p className="text-xs text-neutral-11 mb-3">
                          It seems there's currently no rally happening later today that matches your interests.
                        </p>

                        <Link className="text-2xs link" href={ROUTE_SEARCH_RALLIES}>
                          Browse all rallies happening later today
                        </Link>
                      </section>
                    </>
                  ) : (
                    <div className="gap-2 flex flex-col mt-4">
                      <ListFilteredRallies
                        skip={0}
                        perPage={8}
                        isLoading={queryAudioChatsHappeningLater?.isLoading}
                        isError={queryAudioChatsHappeningLater?.isError}
                        list={queryAudioChatsHappeningLater?.data}
                        setSkip={() => console.log('')}
                      />
                      <Link
                        className="px-3 text-2xs font-semibold text-neutral-12 flex items-center"
                        href={ROUTE_SEARCH_RALLIES}
                      >
                        Browse more rallies happening later today
                        <ArrowRightIcon className="w-4 mis-2" />
                      </Link>
                    </div>
                  )}
                </>
              )}
            </section>
          </div>
          <section className="mt-12 py-8 px-6 mx-auto text-start xs:text-center bg-neutral-3 w-full rounded-lg flex flex-col xs:items-center justify-center ">
            <p className="font-bold">Want to host live audio rooms ?</p>
            <p className="text-xs mt-2  text-neutral-11">
              Rally makes it easy to create and find interesting audio rooms without compromising your privacy or
              recreating your audience from scratch.
            </p>
            <p className="text-xs mt-4 font-medium text-neutral- mb-6">
              If you're looking for an alternative to Twitter Space or Clubhouse, give Rally a try and see how it can
              help you connect with your audience.
            </p>
            <Link className={button({ scale: 'sm', intent: 'primary-outline' })} href={ROUTE_RALLY_NEW}>
              Create my rally now
            </Link>
          </section>
        </main>
      </>
    </>
  )
}

export default Page
