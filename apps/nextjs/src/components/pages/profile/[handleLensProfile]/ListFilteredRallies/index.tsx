import Button from '@components/Button'
import CardRally from './CardRally'
import { DICTIONARY_STATES_AUDIO_CHATS } from '@helpers/mappingAudioChatState'

interface ListFilteredRalliesProps {
  list: Array<any>
  skip: number
  isLoading: boolean
  isError: boolean
  perPage: number
  setSkip: (skip: number) => void
}
export const ListFilteredRallies = (props: ListFilteredRalliesProps) => {
  const { list, isError, isLoading, setSkip, skip, perPage } = props

  return (
    <>
      <ul className="animate-appear grid grid-cols-1 xs:grid-cols-2 xl:grid-cols-3 gap-8">
        {list.map((audioChat: any, i: number) => {
          return (
            <li
              className={`${
                [DICTIONARY_STATES_AUDIO_CHATS.CANCELLED.label].includes(audioChat.state) ? 'opacity-50' : ''
              } animate-appear`}
              key={`profile-list-filtered-rallies-card-rally-${audioChat.cid}`}
            >
              <CardRally data={audioChat} />
            </li>
          )
        })}
      </ul>
      {list?.length > 0 && (
        <div className="animate-appear flex flex-col items-center xs:flex-row mx-auto pt-20 gap-3">
          <Button
            onClick={() => {
              setSkip(skip - perPage)
            }}
            scale="xs"
            className="w-fit-content"
            intent="neutral-ghost"
            isLoading={isLoading}
            disabled={isLoading || isError || skip === 0}
          >
            Show previous page
          </Button>
          <Button
            onClick={() => {
              setSkip(skip + perPage)
            }}
            scale="xs"
            className="w-fit-content"
            intent="neutral-ghost"
            isLoading={isLoading}
            disabled={isLoading || isError || list?.length === 0 || list?.length < perPage}
          >
            Show next page
          </Button>
        </div>
      )}
    </>
  )
}

export default ListFilteredRallies
