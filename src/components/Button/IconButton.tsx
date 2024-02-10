import '../../assets/css/Button/iconButton.css'


interface Props {
    children: React.ReactNode;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    className?: string;
    invisible?:boolean,
}

export default function IconButton(props: Props) {
    const {
        children,
        onClick = (event: React.MouseEvent<HTMLButtonElement>) => {},
        className = '',
        invisible = false,
    } = props;

    return (
        <div>
            {invisible?(<></>):(
                <button
                onClick={onClick}
                className="iconButton"
                >
                {children}
                </button>
            )}
        </div>
        
    );
}