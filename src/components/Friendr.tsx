import '../assets/css/friendr.css'

interface Props {
  open: boolean;
  // onClose: Function;
}

export default function Friendr(props:Props) {
  const {open} = props;

  if (!open) {
    return <></>;
  }

  return (
    <div className='friendr'>
      <div className='wrapper'>
        
        <div>
          <div className='rotate'><i className='fa-solid fa-spinner'></i></div>
          Finding Friend...
        </div>
      </div>
    </div>
  )
}
