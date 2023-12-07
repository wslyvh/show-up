interface Props {
  options: string[]
  selected?: string
  onSelect: (option: string) => void
}

export function Tabs(props: Props) {
  return (
    <div role='tablist' className='tabs tabs-boxed tabs-sm bg-black'>
      {props.options.map((option) => (
        <a
          key={option}
          role='tab'
          className={`tab ${option === props.selected ? 'tab-active' : ''}`}
          onClick={() => props.onSelect(option)}>
          {option}
        </a>
      ))}
    </div>
  )
}
