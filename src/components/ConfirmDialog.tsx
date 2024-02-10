import Dialog from './Dialog';
import Button from './Button/Button';

interface Props {
  title: string;
  children: React.ReactNode;
  open: boolean;
  onClose: Function;
  onConfirm: Function;
}
export default function Confirm(props: Props) {
  const { open, onClose, title, children, onConfirm } = props;
  if (!open) {
    return <></>;
  }
  
  return (
    <Dialog open={open} onClose={onClose}>
      <h2 style={{fontSize:"1.25rem", lineHeight:"1.75rem"}}>{title}</h2>
      <div style={{paddingTop:"1.25rem", paddingBottom:"1.25rem", textAlign:"justify"}}>{children}</div>
      <div style={{display:"flex", justifyContent:'flex-end'}}>
        <div style={{padding:"0.25rem"}}>
          <Button
            onClick={() => onClose()}
            style={{backgroundColor:"red"}}
            className={'red-btn'}
          >
            No
          </Button>
        </div>
        <div style={{padding:"0.25rem"}}>
          <Button
            style={{backgroundColor:"#066418"}}
            className={'green-btn'}
            onClick={() => {
              onClose();
              onConfirm();
            }}
          >
            Yes
          </Button>
        </div>
      </div>
    </Dialog>
  );
}