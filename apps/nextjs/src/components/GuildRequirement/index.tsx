import shortenEthereumAddress from '@helpers/shortenEthereumAddress'
import useGetGuildById from '@hooks/useGetGuildById'
import { formatDuration } from 'date-fns'

const RequirementNFT = (props: any) => {
  const { requirement } = props
  const attributeValue = requirement.data?.attribute?.value
  return (
    <>
      {`Own ${
        requirement.data?.id
          ? `the #${requirement.data.id}`
          : requirement.data?.maxAmount > 0
          ? `${requirement.data?.minAmount}-${requirement.data?.maxAmount}`
          : requirement.data?.minAmount > 1
          ? `at least ${requirement.data?.minAmount}`
          : 'a(n)'
      } `}
      {requirement.symbol === '-' &&
      requirement.address?.toLowerCase() === '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85' ? (
        'ENS'
      ) : requirement.name === '-' ? (
        <code>{shortenEthereumAddress(requirement.address)}</code>
      ) : (
        requirement.name
      )}
      {requirement.data?.attribute?.trait_type
        ? ` ${
            attributeValue || requirement.data?.attribute?.interval
              ? ` with ${
                  requirement.data?.attribute?.interval
                    ? `${requirement.data?.attribute?.interval?.min}-${requirement.data?.attribute?.interval?.max}`
                    : attributeValue
                } ${requirement.data?.attribute?.trait_type}`
              : ''
          }`
        : ` NFT${requirement.data?.maxAmount > 0 || requirement.data?.minAmount > 1 ? 's' : ''}`}
      &nbsp; ({requirement.chain})
    </>
  )
}
export const GuildRequirement = (props: any) => {
  const { requirement } = props
  const queryGuild = useGetGuildById({
    id: requirement?.data?.guildId,
    options: { enabled: requirement?.data?.guildId ? true : false },
  })

  switch (requirement.type) {
    case 'FREE': {
      return <>Connect your Ethereum wallet</>
    }
    case 'ERC20': {
      return (
        <>
          Hold {requirement.data?.minAmount > 0 ? `at least ${requirement.data?.minAmount}` : 'Any amount of'}{' '}
          {requirement.symbol} ({requirement.chain})
        </>
      )
    }
    case 'ERC721': {
      return <RequirementNFT requirement={requirement} />
    }

    case 'ERC1155': {
      return <RequirementNFT requirement={requirement} />
    }
    case 'NOUNS': {
      return <RequirementNFT requirement={requirement} />
    }

    case 'ALLOWLIST': {
      return <>Be included in allowlist</>
    }
    case 'LENS_PROFILE': {
      return <>Have a Lens Protocol profile</>
    }
    case 'LENS_FOLLOW': {
      return (
        <>
          Follow{' '}
          <a target="_blank" rel="noopener noreferrer" href={`https://lenster.xyz/u/${requirement.data.id}`}>
            {requirement.data.id}
          </a>{' '}
          on Lens Protocol
        </>
      )
    }
    case 'LENS_MIRROR': {
      return (
        <>
          Mirror the{' '}
          <a target="_blank" rel="noopener noreferrer" href={`https://lenster.xyz/posts/${requirement.data.id}`}>
            {requirement.data.id} post
          </a>{' '}
          on Lens Protocol{' '}
        </>
      )
    }
    case 'LENS_COLLECT': {
      return (
        <>
          Collect the{' '}
          <a target="_blank" rel="noopener noreferrer" href={`https://lenster.xyz/posts/${requirement.data.id}`}>
            {requirement.data.id} post
          </a>{' '}
          on Lens Protocol{' '}
        </>
      )
    }
    case 'TWITTER_FOLLOW': {
      return (
        <>
          Follow{' '}
          <a target="_blank" rel="noopener noreferrer" href={`https://twitter.com/${requirement.data.id}`}>
            @{requirement.data.id}
          </a>{' '}
          on Twitter
        </>
      )
    }
    case 'TWITTER_BIO': {
      return <>Have "{requirement.data.id}" in your Twitter bio</>
    }
    case 'TWITTER_FOLLOWER_COUNT': {
      return (
        <>
          Have {requirement.data?.minAmount > 0 ? `at least ${requirement.data?.minAmount}` : 'Any amount of'} followers
          on Twitter
        </>
      )
    }
    case 'TWITTER_NAME': {
      return <>Have "{requirement.data.id}" in your Twitter username</>
    }
    case 'NOOX': {
      return (
        <>
          Own Noox badge {requirement.data.id} ({requirement.chain})
        </>
      )
    }
    case 'GUILD_ROLE': {
      const role = queryGuild?.data?.roles?.find((r: any) => r.id === requirement.data.roleId)
      return (
        <>
          Have the role {role?.name ?? 'unknown'} in the
          <a
            href={`https://guild.xyz/${queryGuild?.data?.urlName ?? requirement.data.guildId}`}
            rel="noreferrer nofollow"
            target="_blank"
          >
            {queryGuild?.data?.name ?? `#${requirement.data.guildId}`}
          </a>
          guild
        </>
      )
    }

    case 'GUILD_USER_SINCE': {
      return <> Be a Guild.xyz user at least since {requirement.data.creationDate}</>
    }

    case 'GUILD_MINGUILDS': {
      return (
        <>
          Be a member of at least {requirement.data.minAmount} guild{requirement.data.minAmount > 1 ? 's' : ''}
        </>
      )
    }

    case 'GUILD_ADMIN': {
      return (
        <>
          Be an admin of a guild{' '}
          {requirement.data.minAmount > 0
            ? ` with at least ${requirement.data.minAmount} member${requirement.data.minAmount > 1 ? 's' : ''}`
            : ''}
        </>
      )
    }

    case 'JUICEBOX': {
      return (
        <>
          Hold {requirement.data?.minAmount > 0 ? `at least ${requirement.data?.minAmount}` : 'Any amount of'} tickets
          in our Juicebox
        </>
      )
    }
    case 'CONTRACT': {
      return (
        <>
          Satisfy custom query of <code>{requirement.data.id.split('(')[0]}</code> on the contract{' '}
          <code>{shortenEthereumAddress(requirement.address)}</code>
        </>
      )
    }
    case 'DISCORD_ROLE': {
      return (
        <>
          {`Have the `}
          {requirement.data.roleName}
          {` role in the `}
          {requirement.data.serverName}
          {` server`}
        </>
      )
    }

    case 'DISCORD_JOIN': {
      const formattedDate = new Date(requirement.data.memberSince).toLocaleDateString()

      return requirement.type === 'DISCORD_MEMBER_SINCE' ? (
        <>
          {`Be member of the `}
          {requirement.data.serverName}
          {` server since at least `}
          {formattedDate}
        </>
      ) : (
        <>
          {`Be a Discord user since at least `}
          {formattedDate}
        </>
      )
    }
    case 'DISCORD_JOIN_FROM_NOW': {
      const memberSince = requirement?.data.memberSince / 86400000
      const memberSinceInYears = memberSince / 365
      const format = ['months', 'weeks', 'hours', 'minutes']
      return (
        <>
          Have a Discord account older than{' '}
          {formatDuration(
            {
              days: memberSince,
              months: memberSince / 30,
              years: memberSince / 365,
            },
            {
              format: memberSinceInYears > 1 ? ['years', ...format] : [...format],
              zero: false,
            },
          )}
        </>
      )
    }
    case 'POAP': {
      return (
        <>
          Own the POAP {requirement.data.id} ({requirement.chain})
        </>
      )
    }
    case 'COIN': {
      return (
        <>
          Hold {requirement.data?.minAmount > 0 ? 'at least' : 'Any amount of '} {requirement.symbol}
        </>
      )
    }
    case 'GITPOAP': {
      return (
        <>
          Own GitPOAP {requirement.data.id} ({requirement.chain})
        </>
      )
    }
    case 'GALAXY': {
      return (
        <>
          Participate in campaign {requirement.data.galaxyId} ({requirement.chain})
        </>
      )
    }
    case '101': {
      return <>Have the badge of the 101 course</>
    }

    case 'GITHUB_STARRING': {
      return (
        <>
          Give a star to the &nbsp;
          <a target="_blank" rel="noopener noreferrer" href={requirement.data.id ?? ''} className="link">
            {requirement.data.id.match(/https:\/\/github\.com\/(.+)$/i)[1]}
          </a>
          &nbsp;repository
        </>
      )
    }

    case 'DISCO': {
      const param = requirement.data.params
      return (
        <>
          Have a Disco.xyz {param.credType ? `${param.credType}` : `account`}{' '}
          {param.credIssuence
            ? ` issued ${param.credIssuence} ${new Date(param.credIssuenceDate).toLocaleDateString()}`
            : ``}
          {param.credIssuer ? ` from ${shortenEthereumAddress(param.credIssuer)}` : ``}
        </>
      )
    }
    case 'UNLOCK': {
      return <>Own a(n) ${requirement.name} NFT</>
    }

    case 'SNAPSHOT': {
      return (
        <>
          <table>
            <thead>
              <tr>
                <th>Param</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(requirement.data?.strategy?.params || {})?.map(([name, value]) => (
                <tr key={`${name}`}>
                  <td>{name}</td>
                  <td>{value?.toString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )
    }
    default:
      return <>{requirement.name}</>
  }
}

export default GuildRequirement
