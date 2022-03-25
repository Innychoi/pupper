import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Autocomplete, Button, Slider, TextField, TextareaAutosize } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PetsIcon from '@mui/icons-material/Pets';
import InfoIcon from '@mui/icons-material/Info';
import Typography from '@mui/material/Typography';
import breeds from '../../../breeds.js'
import { useMainContext } from './Providers/MainProvider.jsx';
import { LoadingButton } from '@mui/lab';
import SendIcon from '@mui/icons-material/Send';


function ProfileSetup(props) {
  const { userProfile, setUserProfile } = useMainContext();
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState({
    aboutMe: '',
    age: '',
    breed: '',
    energy: '',
    gender: '',
    imgUrl: '',
    name: '',
    offLeash: '',
    ownerName: '',
    size: ''
  })
  let navigate = useNavigate();
  let { username } = useParams();

  useEffect(() => {
    console.log('userProfile: ', userProfile._id)
    console.log('info before: ', info)
    if (userProfile._id) {
      const config = { params: {_id: userProfile._id} }
      axios.get('/api/profile', config)
      .then ((res) => {
        console.log('res: ', res)
        setInfo({
          aboutMe: res.data.aboutMe,
          age: res.data.age,
          breed: res.data.breed,
          energy: res.data.energy,
          gender: res.data.gender,
          imgUrl: res.data.imgUrl,
          name: res.data.name,
          offLeash: res.data.offLeash,
          ownerName: res.data.ownerName,
          size: res.data.size
        })
      })
    }
  },[])

  console.log('info after: ', info);

  const sizeMarks = [
    {
      value: 1,
      label: 'Small',
    },
    {
      value: 2,
      label: 'Medium',
    },
    {
      value: 3,
      label: 'Large',
    }
  ];

  const ageMarks = [
    {
      value: 1,
      label: 'Puppy',
    },
    {
      value: 2,
      label: 'Adult',
    },
    {
      value: 3,
      label: 'Senior',
    },
  ];

  const genderMarks = [
    {
      value: 0,
      label: 'Female',
    },
    {
      value: 1,
      label: 'Male',
    },
  ];

  const energyMarks = [
    {
      value: 0,
      label: 'Low',
    },
    {
      value: 1,
      label: 'Medium',
    },
    {
      value: 2,
      label: 'High',
    },

  ];

  const leashMarks = [
    {
      value: 0,
      label: 'on',
    },
    {
      value: 1,
      label: 'off',
    },
  ];

  function sizeFormatVal(value) {
    for (let i = 0; i < sizeMarks.length; i++) {
      if (sizeMarks[i].value === value) {
        return sizeMarks[i].label
      }
    }
  }

  function ageFormatVal(value) {
    for (let i = 0; i < ageMarks.length; i++) {
      if (ageMarks[i].value === value) {
        return ageMarks[i].label
      }
    }
  }

  function genderFormatVal(value) {
    for (let i = 0; i < genderMarks.length; i++) {
      if (genderMarks[i].value === value) {
        return genderMarks[i].label
      }
    }
  }

  function energyFormatVal(value) {
    for (let i = 0; i < energyMarks.length; i++) {
      if (energyMarks[i].value === value) {
        return energyMarks[i].label
      }
    }
  }

  function leashFormatVal(value) {
    for (let i = 0; i < leashMarks.length; i++) {
      if (leashMarks[i].value === value) {
        return leashMarks[i].label
      }
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    e.persist();
    const data = new FormData();
    data.append('file', e.target.photo.files[0]);
    data.append('upload_preset', 'pupper');
    data.append('cloud_name', 'chewychewy');
    axios.post('https://api.cloudinary.com/v1_1/chewychewy/image/upload', data)
      .then((res) => {
        let serverPackage = {
          name: e.target.name.value,
          age: ageFormatVal(Number(e.target.age.value)),
          gender: genderFormatVal(Number(e.target.gender.value)),
          breed: e.target.breed.value,
          size: sizeFormatVal(Number(e.target.size.value)),
          energy: energyFormatVal(Number(e.target.energy.value)),
          offLeash: e.target.offLeash.value === '1' ? true : false,
          ownerName: e.target.ownerName.value,
          aboutMe: e.target.aboutMe.value,
          uid: userProfile,
          imgUrl: res.data.url,
        };

        axios.post('/api/profile', serverPackage)
          .then((result) => {
            setUserProfile(result.data);
            localStorage.setItem('userProfile', JSON.stringify(result.data));
            localStorage.setItem('uid', result.data.uid)
            navigate("/preferences");
          })
          .catch(err => console.log(`Profile post error:`, err))

      })
      .catch((err) => {
        console.log('Cloudinary profile post err:', err);
      });
  }


  return (
    <>
      <Typography style={{ fontSize: 30, fontWeight: 700, color: '#ff9800', textAlign: 'center', fontFamily:'Courgette' }}>Pupper</Typography>
      <form onSubmit={handleSubmit}>

        <PetsIcon sx={{ color: 'action.active', mr: 1, my: 3 }} />
        <TextField id="name" label="My name" variant="standard" /> <br />
        <InfoIcon sx={{ color: 'action.active', mr: 1, my: 3 }} />
        <TextareaAutosize id="aboutMe" aria-label="empty textarea" minRows={4} placeholder="About Me" style={{ width : 200 }} /> <br />
        <AccountCircleIcon sx={{ color: 'action.active', mr: 1, my: 3 }} />
        <TextField id="ownerName" label="My owner's name" variant="standard" />
        <Autocomplete
        disablePortal
        id="breed"
        options={breeds}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Breed" />}
      />
        <Typography style={{marginLeft: "30%", marginRight: "30%"}}>


          <Typography style={{textAlign: "center", marginTop: "10px"}}>Size</Typography>
          <Slider name="size" step={1} min={1} max={3}
            defaultValue={
              info.size === 'Small' ?
                1
              : info.size === 'Medium' ?
                2
              : info.size === 'Large' ?
                3
              :
                1
            } marks={sizeMarks} aria-label="Default"  valueLabelDisplay="auto" valueLabelFormat={sizeFormatVal}/>


          <Typography style={{textAlign: "center", marginTop: "10px"}}>Pupper Gender</Typography>
          <Slider name="gender" step={1} min={0} max={1} defaultValue={info.gender === 'Male' ? 1 : 0} marks={genderMarks} valueLabelFormat={genderFormatVal} aria-label="Default"  valueLabelDisplay="auto" />


          <Typography style={{textAlign: "center"}}>Pupper Age</Typography>
          <Slider name="age" step={1} min={1} max={3}
          defaultValue={
            info.age === 'Puppy' ?
              1
            : info.age === 'Adult' ?
              2
            : info.age === 'Senior' ?
              3
            :
              1
          } marks={ageMarks} valueLabelFormat={ageFormatVal} aria-label="Default"  valueLabelDisplay="auto" />


          <Typography style={{textAlign: "center", marginTop: "10px"}}>Energy Level</Typography>
          <Slider name="energy" step={1} min={0} max={2}
            defaultValue={
              info.energy === 'Low' ?
                0
              : info.energy === 'Medium' ?
                1
              : info.energy === 'High' ?
                2
              :
                0
              } marks={energyMarks} valueLabelFormat={energyFormatVal} aria-label="Default" valueLabelDisplay="auto" />


          <Typography style={{textAlign: "center", marginTop: "10px"}}>Leash On/Off</Typography>
          <Slider name="offLeash" step={1} min={0} max={1} defaultValue={info.offLeash === true ? 1 : 0} marks={leashMarks} valueLabelFormat={leashFormatVal} aria-label="Default"  valueLabelDisplay="auto" />

        </Typography>
        <Button
          variant="contained"
          component="label"
          onClick={() => {console.log('im clicked')}}
        >
          Upload File
          <input
            id="photo"
            type="file"
            hidden
          />
        </Button>
        <LoadingButton
          type="submit"
          size="small"
          endIcon={<SendIcon />}
          loading={loading}
          loadingPosition="end"
          variant="contained"
        >
          {props.submitLabel}
        </LoadingButton>
      </form>
    </>
  )
}

export default ProfileSetup;