import { useState } from 'react'
import '../assets/css/register.css'
import { registerAsync } from '../services/authServices';
import { zodiacUsernames, zodiacAvatarURLs } from '../config/randConfig';
import { useNavigate } from 'react-router-dom';
import Avatar from '../components/Avatar';
import { v4 as getID } from "uuid";
import TagsInput from '../components/TagsInput';


export default function Register() {
  // const emailRef = useRef(null);
  // const passRef = useRef(null);
  // const fnameRef = useRef(null);
  // const lnameRef = useRef(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [block, setBlock] = useState("");
  const [desc, setDesc] = useState("I hope we can be friends!");
  const [profileImage, setProfileImage] = useState(null);
  const [tags, setTags] = useState([]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);


  const navigate = useNavigate();

  const clearInputs = () => {
    if (email) setEmail("");
    if (password) setPassword("");
    if (fname) setEmail("");
    if (lname) setPassword("");
    if (block) setEmail("");
    if (desc) setPassword("");
    if (tags) setTags([]);
  }

  const handleImages = (e) => {
    const file = e.target.files[0];
    const Image = {
      origin: file.name,
      filename: getID() + "-" + file.name,
      file
    };
    setProfileImage(Image);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (profileImage == null)
      return setError("Please upload an image of your face.");
    else setError("");

    setLoading(true);

    let selectZodiacUsername = Math.floor(Math.random() * zodiacUsernames.length);
    let selectRndNum = Math.floor(10000 + Math.random() * 90000);

    let selection = [selectZodiacUsername, selectRndNum];
    const creds = {
      username: zodiacUsernames[selection[0]] + "_" + selection[1],
      uProfile: zodiacAvatarURLs[selection[0]],
      profileImage: profileImage,
      fname: fname,
      lname: lname,
      block: block,
      uscID: email.replace("@usc.edu.ph", ""),
      email: email,
      password: password,
      desc: desc,
      tags: tags,
    };

    try {
      await registerAsync(creds);
      clearInputs();
      setLoading(false);
      navigate("/login");
    } catch (error) {
      const message = error.code;
      setError(message);
      setLoading(false);
    }

  };

  const handlePage = (gotoPage, e) => {
    e.preventDefault();

    switch (page) {
      case (1):
        // if (email == "" || password == "" || lname == "" || fname == "" || block == "")
        //   return setError("Please completely fill up the form.");

        // if (!block.match("^[STEM][1-9][0-9]*"))
        //   return setError("Please input block properly. (T2, S10, E7...)");

        // if (!email.match("^[0-9]+@usc\.edu\.ph"))
        //   return setError("Please use a USC email.");

        if (error != "") setError("");
        setPage(gotoPage);
        console.log(page);

        break;

      case (2):
        // if ((desc == "" || tags.length == 0) && gotoPage == 3)
        //   return setError("Please completely fill up the form.");

        if (error != "") setError("");
        if (gotoPage == 2) setPage(gotoPage);
        else setPage(gotoPage);
        break;

      case (3):

        if (error != "") setError("");
        setPage(gotoPage);
        break

      default:
        break;
    };
  };

  const handleSubmitTest = async (e) => {
    e.preventDefault();
    
    if (profileImage == null)
      return setError("Please upload an image of your face.");
    else setError("");
      
    setLoading(true);



    try {
      let selectZodiacUsername = Math.floor(Math.random() * zodiacUsernames.length);
      let selectRndNum = Math.floor(10000 + Math.random() * 90000);

      let selection = [selectZodiacUsername, selectRndNum];

      const creds = {
        username: zodiacUsernames[selection[0]] + "_" + selection[1],
        uProfile: zodiacAvatarURLs[selection[0]],
        fname: fname,
        lname: lname,
        uscID: email.replace("@usc.edu.ph", ""),
        block: block,
        email: email,
        password: password,
        desc: desc,
        tags: tags,
      };


      console.log(creds)
      setLoading(false);
    } catch (error) {
      const message = error.code;
      setError(message);
      setLoading(false)
    }

  };


  return (
    <div className='register'>
      <div className='wrapper'>
        <h2 className='heading'>Register</h2>
        <form className='form'>
          {error && <span className='error-msg'>{error}</span>}


          {(page == 1) ? ( // Page 1
            <div className='form'>
              <input required value={fname} onChange={(p) => setFname(p.target.value)} id='fname' type='text' placeholder='First Name' />
              <input required value={lname} onChange={(p) => setLname(p.target.value)} id='lname' type='text' placeholder='Last Name' />
              <input required value={block} maxLength={3} pattern='^[STEM][0-9][0-9]' onChange={(p) => {p.target.value.toUpperCase(); setBlock(p.target.value);}} id='block' type='text' placeholder='Block' />
              <input required value={email} onChange={(p) => setEmail(p.target.value)} pattern='^[0-9]+@usc\.edu\.ph' id="email" type='email' placeholder='USC Email' />
              <input required value={password} onChange={(p) => setPassword(p.target.value)} id="password" type='password' placeholder='Password' />

              <hr/>

              <button className='btnProceed' onClick={(e) => handlePage(2, e)}>
                {'Next '}<i id='arrow-right' className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          ) : (<div></div>)
          }

          {(page == 2) ? ( // Page 2
            <div className='form'>

              <label className='input-label'>Description</label>
              <textarea required value={desc} onChange={(p) => setDesc(p.target.value)} id='desc' placeholder='Write about yourself.' maxLength={60} />

              <label className='input-label'>
                Interests 
                <span style={{ color: 'gray', fontWeight: 'normal', fontSize: '15px', marginLeft: '5px' }}>
                  {`(tags left: ${10 - tags.length}; enter to add)`}
                </span>
              </label>
              <TagsInput tags={tags} setTags={setTags} />

              <hr/>

              <button className='btnBack' onClick={(e) => handlePage(1, e)}>
                <i id='arrow-left' className="fa-solid fa-arrow-left point-left"></i>{' Back'}
              </button>
              <button className='btnProceed' onClick={(e) => handlePage(3, e)}>
                {'Next '}<i id='arrow-right' className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          ) : (<div></div>)
          }

          {(page == 3) ? ( // Page 3
            <div className='form'>

              <div className="avatar-wrapper">

                <label className='upload-image' htmlFor="upload-image">
                  <input
                    style={{ display: "none" }}
                    type="file"
                    accept='.jpg,.jpeg,.png'
                    id="upload-image"
                    onChange={handleImages}
                  />
                  {profileImage ? (
                    <Avatar
                      src={profileImage ? URL.createObjectURL(profileImage.file) : ""}
                      height={200}
                      width={200}
                    />
                  ) : (
                    <Avatar
                      src=''
                      height={200}
                      width={200}
                    />
                  )}
                  <i className="fa-solid fa-camera"></i>
                </label>
                
              </div>
              <span className='note'>Image must show your face!</span>

              <hr/>

              <button className='btnBack' onClick={(e) => handlePage(2, e)}>
                <i id='arrow-left' className="fa-solid fa-arrow-left point-left"></i>{' Back'}
              </button>
              <button className='btnProceed' disabled={loading} onClick={handleSubmitTest}>
                {loading ? 'Loading...' : 'Register'}
              </button>
            </div>
          ) : (<div></div>)
          }


          <span className="link">
            <a href='/login'>Already got an account? Login here.</a>
          </span>
        </form>
      </div>
    </div>
  )
}
