import '../assets/css/dialog.css'

import IconButton from './Button/IconButton';

interface Props {
  children: React.ReactNode;
  open: boolean;
  onClose: Function;
  noBlock?: boolean;
}

export default function Dialog({noBlock=true, ...props}: Props) {
  const { open, onClose } = props;
  if (!open) {
    return <></>;
  }
  return (
    <div className="dialog" onClick={()=>noBlock?onClose():null}>
      <div className="wrapper">
        <div>{props.children}</div>
        <span className="span">
        <IconButton invisible={false} onClick={() => onClose()}>
          <svg
            className="exitButton"
            role="button"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
          </svg>
        </IconButton>
      </span>
     </div>
   </div>
 );
}