import { useState } from 'react'
import '../assets/css/register.css'
import { registerAsync } from '../services/authServices';
import { zodiacUsernames, zodiacAvatarURLs } from '../config/randConfig';
import { useNavigate } from 'react-router-dom';
import Avatar from '../components/Avatar';
import { v4 as getID } from "uuid";
import TagsInput from '../components/TagsInput';
import Select from 'react-select';


export default function Register() {
  // const emailRef = useRef(null);
  // const passRef = useRef(null);
  // const fnameRef = useRef(null);
  // const lnameRef = useRef(null);

  const infolink = "https://lenicon.gitbook.io/friend.ly/"

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [block, setBlock] = useState("");
  const [desc, setDesc] = useState("I hope we can be friends!");
  const [profileImage, setProfileImage] = useState(null);
  // const [profileImage2, setProfileImage2] = useState(null);
  const [tags, setTags] = useState([]);
  // const [matches, setMatches] =useState([]);
  const [tconfirm, setTconfirm] = useState(false);
  const [pconfirm, setPconfirm] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const blocksArray=[ 'S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 'S10', 'ST', 'T1', 'T2', 'T3', 'E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7'];
  const optionsBlock = [];
  blocksArray.forEach((element)=>{
    optionsBlock.push({value:`STEM 12 ${element}`, label:`STEM 12 ${element}`});
  });


  const navigate = useNavigate();

  const clearInputs = () => {
    if (email) setEmail("");
    if (password) setPassword("");
    if (confirmpassword) setConfirmPassword("");
    if (fname) setEmail("");
    if (lname) setPassword("");
    if (block) setBlock("");
    if (desc) setDesc("");
    if (tags) setTags([]);
  }

  const handleImages = (e) => {
    const file = e.target.files[0];
    const Image = {
      origin: file.name,
      filename: getID() + "-" + file.name,
      file
    };
    // const Image2 = {
    //   origin: file.name,
    //   filename: getID() + "-" + file.name,
    //   url: URL.createObjectURL(file)
    // };
    setProfileImage(Image);
    // setProfileImage2(Image2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (tconfirm == false) return setError("Please read and accept our Terms & Conditions.");
    else setError("");
    
    if (pconfirm == false) return setError("Please read and accept our Privacy Policy.")
    else setError("");

    setLoading(true);


    let selectZodiacUsername = Math.floor(Math.random() * zodiacUsernames.length);
    let selectRndNum = Math.floor(10000 + Math.random() * 90000);

    let selection = [selectZodiacUsername, selectRndNum];
    const creds = {
      username: zodiacUsernames[selection[0]] + "_" + selection[1],
      uProfile: zodiacAvatarURLs[selection[0]],
      profile: profileImage,
      fname: fname,
      lname: lname,
      block: block,
      uscID: email.replace("@usc.edu.ph", ""),
      email: email,
      password: password,
      desc: desc,
      tags: tags,
      matches: [],
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
        if (email == "" || password == "" || lname == "" || fname == "" || block == "")
          return setError("Please completely fill up the form.");

        if (!email.match("^[0-9]+@usc\.edu\.ph"))
          return setError("Please use a USC email.");

        if (email)

        if (password != confirmpassword)
          return setError("Confirmation Password does not match.");

        if (password.length < 8)
          return setError("Password length is less than 8.");

        if (error != "") setError("");
        setPage(gotoPage);

        break;

      case (2):
        if (gotoPage == 2) setPage(gotoPage);
        else {
          if ((desc == "" || tags.length == 0))
          return setError("Please completely fill up the form.");

          if (error != "") setError("");
          setPage(gotoPage);
        }
        break;

      case (3):
        if (gotoPage == 3) setPage(gotoPage);
        else {
          if (profileImage == null && gotoPage == 4) return setError("Please upload an image of your face.");
         
          if (error != "") setError("");
          setPage(gotoPage);
        }
        break;
      
      case (4):
        if (error != "") setError("");
        setPage(gotoPage);
        break;

      default:
        break;
    };
  };


  return (
    <div className='register'>
      <div className='wrapper'>
        <h2 className='heading'>Register</h2>
        <form id='registerForm' className='form'>
          {error && <span className='error-msg'>{error}</span>}


          {(page == 1) ? ( // Page 1
            <div className='form' onSubmit={(e) => handlePage(2, e)}>
              <input required value={fname} onChange={(p) => setFname(p.target.value)} id='fname' type='text' placeholder='First Name' aria-label='firstname'/>
              <input required value={lname} onChange={(p) => setLname(p.target.value)} id='lname' type='text' placeholder='Last Name' aria-label='lastname' />
              
              <Select
              placeholder='Select Block...'
              styles={{
                control: (defaultStyles) => ({
                  ...defaultStyles,
                  border: '2px solid #00000033',
                  borderRadius: "0.3rem",
                  fontSize: "1rem",
                  verticalAlign: 'middle',
                  height:'3em',
                  minHeight: "3em",
                  color: "#333",
                  display: "flex",
                  alignItems: "center",
                  outline: "none",
                  width: "100%",
                  scrollBehavior: "smooth",
                  justifyContent: "center"

                }),

                valueContainer: (provided) => ({
                  ...provided,
                  height: '3em'
                }),
            
                input: (provided) => ({
                  ...provided,
                  margin: '0px',
                }),

                option: (base, {isDisabled, isFocused, isSelected}) => ({
                  ...base,
                  backgroundColor: isSelected? "#066418" : isFocused ? "#a2cc8a":"white",
                  color: isDisabled ? "gray" : isSelected? "white" : isFocused ? "#05513":"#333",

                })

              }}
              className='select'
              isSearchable={false}
              options={optionsBlock}
              defaultValue={block}
              autoFocus={false}
              onChange={(selected)=>setBlock(selected)}
              
              />

              <input aria-label='email' required value={email} onChange={(p) => setEmail(p.target.value)} pattern='^[0-9]+@usc\.edu\.ph' id="email" type='email' placeholder='USC Email' />
              <input aria-label='password' required value={password} onChange={(p) => setPassword(p.target.value)} id="password" type='password' placeholder='Password' minLength={8} />
              <input aria-label='confirmpassword' required value={confirmpassword} onChange={(p) => setConfirmPassword(p.target.value)} id="confirmpassword" type='password' placeholder='Confirm Password' minLength={8} />
              <hr/>

              <button className='btnProceed' onClick={(e) => handlePage(2, e)}>
                {'Next '}<i id='arrow-right' className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          ) : (<div></div>)
          }

          {(page == 2) ? ( // Page 2
            <div className='form' onSubmit={(e) => handlePage(3, e)}>

              <label className='input-label'>Description</label>
              <textarea required value={desc} onChange={(p) => setDesc(p.target.value)} id='desc' placeholder='Write about yourself.' maxLength={60} />

              <label className='input-label'>
                Interests 
                <span style={{ color: 'gray', fontWeight: 'normal', fontSize: '15px', marginLeft: '5px' }}>
                  {`(tags left: ${10 - tags.length}; comma to add; backspace to remove)`}
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
            <div className='form' onSubmit={(e) => handlePage(4, e)}>

              <div className="avatar-wrapper">

                <label className='upload-image' htmlFor="upload-image">
                  <input
                    style={{ display: "none" }}
                    type="file"
                    accept='.jpg,.jpeg,.png'
                    id="upload-image"
                    onChange={handleImages}
                    aria-label='upload-image'
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
              <button className='btnProceed' onClick={(e) => handlePage(4, e)}>
                {'Next '}<i id='arrow-right' className="fa-solid fa-arrow-right"></i>
              </button>
              
            </div>
          ) : (<div></div>)
          }

          {(page == 4) ? ( // Page 4
            <div className='form' onSubmit={(e)=>handleSubmit(e)}>

              <label className='cbcontainer' htmlFor="termsncon">I have read and hereby accept the <a href={`${infolink}terms-and-conditions`}>Terms & Conditions</a>.
                <input type='checkbox' onChange={()=>setTconfirm(!tconfirm)} id="termsncon" checked={tconfirm}></input>
                <span className='cbcheckmark'></span>
              </label>
          
              <label className='cbcontainer' htmlFor="privpol">I have read and hereby accept the <a href={`${infolink}privacy-policy`}>Privacy Policy</a>.
                <input type='checkbox' onChange={()=>setPconfirm(!pconfirm)} id="privpol" checked={pconfirm}></input>
                <span className='cbcheckmark'></span>
              </label>
              

              <hr/>

              <button className='btnBack' onClick={(e) => handlePage(3, e)}>
                <i id='arrow-left' className="fa-solid fa-arrow-left point-left"></i>{' Back'}
              </button>
              <button className='btnProceed' disabled={loading} onClick={handleSubmit}>
                {loading ? 'Loading...' : 'Register'}
              </button>
            </div>
          ):(<></>)
          }



          <span className="link">
            <a href='/login'>Already got an account? Login here.</a>
          </span>
        </form>
      </div>
    </div>
  )
}
