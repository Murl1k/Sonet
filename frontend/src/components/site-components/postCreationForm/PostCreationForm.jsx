import styles from './postCreationForm.module.css';
import {useState} from "react";
import {createPost} from "../../../redux/actions/postsAction";
import {toast} from "react-toastify";

export function PostCreationForm({postList, setPosts, groupId}) {
    const [fileName, setFileName] = useState("");
    const [text, setText] = useState("");

    const handleFileChange = (event) => {
        if (event.target.files.length > 0) {
            setFileName(event.target.files[0].name);
        }
    };

    const handleClearFile = () => {
        setFileName("");
        document.getElementById("file-input").value = "";
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();

        formData.append("content", text);
        if (event.target.fileInput.files.length > 0) {
            formData.append("image", event.target.fileInput.files[0]);
        }
        if (groupId) {
            formData.append('group', groupId)
        }

        try {
            const data = await createPost(formData);
            setText("");
            setFileName("");
            document.getElementById("file-input").value = "";

            if (data) {
                setPosts([data, ...postList]);
            }
        } catch (e) {
            toast.error(e)
        }

    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <p>Создать пост</p>
            <textarea maxLength={2048} rows={5} value={text}
                      onChange={(event) => setText(event.target.value)}></textarea>
            <div className={styles.row}>
        <span>
          <label htmlFor="file-input" className={styles.imageLabel}>
            <i className="material-icons">insert_photo</i>
              {fileName ? fileName : "Выберите файл"}
          </label>
            {fileName && (
                <button
                    type="button"
                    className={styles.clearButton}
                    onClick={handleClearFile}
                >
                    <i className="material-icons">delete</i>
                </button>
            )}
        </span>
                <input id="file-input" name="fileInput" type="file" accept="image/*" onChange={handleFileChange}/>
                <button className={styles.submitButton} type="submit"
                        disabled={text.length === 0 && fileName.length === 0}>Отправить
                </button>
            </div>
        </form>
    );
}