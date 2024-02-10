import '../../assets/css/Button/button.css'

interface Props {
    children: React.ReactNode;
    type?: 'submit' | 'button' | 'reset';
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    className?: string;
    style?: object;
  }
export default function Button(props: Props) {
    const { type = 'button', children, onClick, className = '', style={} } = props;
    return (
        <button
        className={`Button ${className}`}
        type={type}
        onClick={onClick}
        style={style}
        >
        {children}
        </button>
    );
}