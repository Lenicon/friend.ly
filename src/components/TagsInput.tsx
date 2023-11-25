import '../assets/css/tagsInput.css';

export default function TagsInput({ tags, setTags }) {

    const handleKeyDown = (e) => {
        if (e.code == "Comma" || e.code == "Enter") {
            e.preventDefault();
            console.log(tags)

            if (tags.length == 10) return;
            const value = e.target.value;
            if (!value.trim()) return;
            if (tags.includes(value)) return;

            setTags([...tags, value.toLowerCase().trim().replace(/_/g, ' ').replace(/\s{2,}/g, '_').replace(/ /g, '_').replace(/,/g, '')]);
            e.target.value='';
        }
    }

    const removeTag = (index) => {
        setTags(tags.filter((e, i) => i != index));
    }

    return (
        <div className='tags-input-container'>
            {tags.map((tag, index) => (
                <div className='tag-item' key={index} onClick={() => removeTag(index)}>
                    <span className='text'>{tag}</span>
                    <span className='close'>
                        &times;
                    </span>
                </div>
            ))}
            {
                <input
                onKeyDown={(e) => handleKeyDown(e)}
                type='text'
                className='tags-input'
                placeholder='broad common interest...'
                maxLength={10}
            />
            }
        </div>
    )
}