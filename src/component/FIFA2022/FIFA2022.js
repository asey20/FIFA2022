import { useEffect, useRef, useState } from 'react';
import * as React from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import './FIFA2022.scss';
import axios from 'axios';
import GkCluster from './GkCluster';
import { SliderValueLabelUnstyled } from '@mui/base';
// import unknown.png from assets
import eric from '../../assets/eric.png';
import bronze_player_card from '../../assets/bronze_player_card.png';
import silver_player_card from '../../assets/silver_player_card.png';
import gold_player_card from '../../assets/gold_player_card.png';
import black_player_card from '../../assets/black_player_card.png';
import { useInView } from 'react-intersection-observer';
import { withTheme } from '@emotion/react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// attributes= ['name', "potential", "value_eur", "age",'goalkeeping_diving', 'goalkeeping_handling',
//              'goalkeeping_kicking','goalkeeping_positioning','goalkeeping_reflexes','goalkeeping_speed']

// features 
//     -Name (Prediction)
//     -overall (0-100)
//     -wage (euros)
//     -value (euros)
//     -age (18+)
//     -goalkeeping_diving (0-100)
//     -goalkeeping_handling (0-100) 
//     -goalkeeping_kicking (0-100)
//     -goalkeeping_positioning (0-100)
//     -goalkeeping_reflexes (0-100)
//     -goalkeeping_speed (0-100)

function FIFA2022 () {
    const { ref, inView } = useInView({ triggerOnce: true });

    const [wage, setWage] = useState(0);
    
    const onWageChange= (selectedWage) => {
        setWage(selectedWage.target.value);
    };

    const [age, setAge] = useState(18);
    
    const onAgeChange= (selectedAge) => {
        setAge(selectedAge.target.value);
    };

    const [diving, setDiving] = useState(75);
    
    const onDivingChange= (selectedDiving) => {
        setDiving(selectedDiving.target.value);
    };

    const [handling, setHandling] = useState(75);

    const onHandlingChange= (selectedHandling) => {
        setHandling(selectedHandling.target.value);
    };   

    const [kicking, setKicking] = useState(75);

    const onKickingChange= (selectedKicking) => {
        setKicking(selectedKicking.target.value);
    };   
      
    const [positioning, setPositioning] = useState(75);

    const onPositioningChange= (selectedPositioning) => {
        setPositioning(selectedPositioning.target.value);
    };

    const [reflexes, setReflexes] = useState(75);

    const onReflexesChange= (selectedReflexes) => {
        setReflexes(selectedReflexes.target.value);
    }; 

    const [speed, setSpeed] = useState(75);

    const onSpeedChange= (selectedSpeed) => {
        setSpeed(selectedSpeed.target.value);
    };   
      
    const getOverallScore = () => {
        return Math.round((
            parseInt(diving) + 
            parseInt(handling) + 
            parseInt(kicking) + 
            parseInt(positioning) + 
            parseInt(reflexes) +        
            parseInt(speed)
        )/6);
    }

    const calculateStatColor = (stat) => {
        if (stat < 60) {
            return "#D11C42";
        } else if (stat < 70) {
            return "#BBAA07";
        } else if (stat < 80) {
            return "#8EAE4E";
        } else {
            return "#3AC842";
        } 
    }

    const calculatePlayerCardTextColor = (overall) => {
        if (overall >= 80) {
            return "white";
        } else {
            return "black";
        }
    }        

    const determinePlayerCardBackground = (overall) => {
        if (overall < 60) {
            return bronze_player_card;
        } else if (overall < 70) {
            return silver_player_card;
        } else if (overall < 80) {
            return gold_player_card;
        } else {
            return black_player_card;
        }
    }

    const [prediction, setPrediction] = useState(null);
    

    function handlePredict(e) {
        e?.preventDefault();

        const overall = getOverallScore();
  
        axios.post('http://localhost:5000/fifa_results',{
            overall: overall,
            wage: wage,
            age: age,
            diving: diving,
            handling: handling,
            kicking: kicking,
            positioning: positioning,
            reflexes: reflexes,
            speed: speed
       }).then(res => {
            console.log(res)
            console.log(res.data)
          
            //sort res.data by how close it is to overall
            res.data.sort((a, b) => {
                return Math.abs(a.overall - overall) - Math.abs(b.overall - overall);
            });

            setPrediction(res.data)
        }).catch(err => {
          console.log(err)
        })
      }

    useEffect(() => {
        handlePredict();
        console.log(prediction);
    }, []);

    return <div className='FIFA2022 section' id='FIFA2022'> 
        <div className="cover"></div>
        <div className='toolbar'>
            <h1>
            FIFA 2022
            </h1>

            <div className='NumInputContainer'>
                    <div className='Age'>
                        <TextField 
                            className='TextField'
                            label="Age"
                            type="number"
                            InputLabelProps={{
                                shrink: true
                            }}
                            InputProps={{
                                inputProps: { min: 18, max: 50 } 
                            }}
                            value={age}
                            onChange={onAgeChange}
                        />
                    </div>

                    <div className='Wage'>
                        <TextField
                            className='TextField'
                            label="Wage"
                            type="number"
                            InputLabelProps={{
                                shrink: true
                            }}
                            InputProps={{
                                startAdornment: <InputAdornment position="start" color="white">$</InputAdornment>,
                                inputProps: { min: 0, max: 200000, step: 1000 } 
                            }}
                            //sx={{ input: { borderColor: 'white' } }}
                            value={wage}
                            onChange={onWageChange}
                        />
                    </div>
            </div>

            <div className="sliders">

                <div className="slider-container">
                    <div className='slider-label'>
                        <span className="label">GK Diving</span>
                        <span className="slider-value" style={{ color: `${calculateStatColor(diving)}` }}>{diving}</span>
                    </div>
                    <div className='diving slider'>
                        <input 
                            type="range" 
                            min="1" 
                            max="100"
                            value={diving}
                            onChange={onDivingChange}
                        />
                        <div className="track" style={{width: `${diving}%`}}></div>
                    </div>
                </div>

                <div className="slider-container">
                    <div className='slider-label'>
                        <span className="label">GK Handling</span>
                        <span className="slider-value" style={{ color: `${calculateStatColor(handling)}` }}>{handling}</span>
                    </div>
                    <div className='handling slider'>
                        <input 
                            type="range" 
                            min="1" 
                            max="100" 
                            value={handling}
                            onChange={onHandlingChange}
                        />

                        <div className="track" style={{width: `${handling}%`}}></div>
                    </div>
                </div>

                <div className="slider-container">
                    <div className='slider-label'>
                        <span className="label">GK Kicking</span>
                        <span className="slider-value" style={{ color: `${calculateStatColor(kicking)}` }}>{kicking}</span>
                    </div>
                    <div className='kicking slider'>
                        <input 
                            type="range" 
                            min="1" 
                            max="100"
                            value={kicking}
                            onChange={onKickingChange}
                        />
                        <div className="track" style={{width: `${kicking}%`}}></div>
                    </div>
                </div>
                
                <div className="slider-container">
                    <div className='slider-label'>
                        <span className="label">GK Positioning</span>
                        <span className="slider-value" style={{ color: `${calculateStatColor(positioning)}` }}>{positioning}</span>
                    </div>
                    <div className='positioning slider'>
                        <input 
                            type="range" 
                            min="1" 
                            max="100"
                            value={positioning}
                            onChange={onPositioningChange}
                        />
                        <div className="track" style={{width: `${positioning}%`}}></div>
                    </div>
                </div>

                <div className="slider-container">
                    <div className='slider-label'>
                        <span className="label">GK Reflexes</span>
                        <span className="slider-value" style={{ color: `${calculateStatColor(reflexes)}` }}>{reflexes}</span>
                    </div>
                    <div className='reflexes slider'>
                        <input 
                            type="range" 
                            min="1" 
                            max="100"
                            value={reflexes}
                            onChange={onReflexesChange}
                        />
                        <div className="track" style={{width: `${reflexes}%`}}></div>
                    </div>
                </div>
                
                <div className="slider-container">
                    <div className='slider-label'>
                        <span className="label">GK Speed</span>
                        <span className="slider-value" style={{ color: `${calculateStatColor(speed)}` }}>{speed}</span>
                    </div>
                    <div className='speed slider'>
                        <input 
                            type="range" 
                            min="1" 
                            max="100"
                            value={speed}
                            onChange={onSpeedChange}
                        />
                        <div className="track" style={{width: `${speed}%`}}></div>
                    </div>
                </div>
            </div> 
            <div className='predictBtnWrapper'>
                <button type="predict" className='predictBtn' onClick={handlePredict}>
                    Predict
                </button>
            </div>   
        </div>
        {
            prediction && 
                <div className='playerList'> 
                    { prediction.map((player, index) => {
                        return <div className='player-card' key={index} style={{ 
                            backgroundImage: `url(${determinePlayerCardBackground(player.overall)})`,
                            color: calculatePlayerCardTextColor(player.overall)
                        }}>
                            <div className='player-card-header'>
                                <div className='player-card-header-left'>
                                    <div className="overall">{player.overall}</div>
                                    <div className="position">GK</div>
                                </div>
                                <div className='player-card-header-right'>
                                    <img src={player.portrait}/>
                                </div>
                            </div>
                            <div className='player-card-body'>
                                <div className="player-name">{player.name}</div>
                                <div className="stats">
                                    <div className="left-stats">
                                        <div className="stat">
                                            <div className="stat-value">{player.diving}</div>
                                            <div className="stat-label">DIV</div>
                                        </div>
                                        <div className="stat">
                                            <div className="stat-value">{player.handling}</div>
                                            <div className="stat-label">HAN</div>
                                        </div>
                                        <div className="stat">
                                            <div className="stat-value">{player.kicking}</div>
                                            <div className="stat-label">KCK</div>
                                        </div>
                                    </div>
                                    <div className="right-stats">
                                        <div className="stat">
                                            <div className="stat-value">{player.positioning}</div>
                                            <div className="stat-label">POS</div>
                                        </div>
                                        <div className="stat">
                                            <div className="stat-value">{player.reflexes}</div>
                                            <div className="stat-label">REF</div>
                                        </div>
                                        <div className="stat">
                                            <div className="stat-value">{player.speed}</div>
                                            <div className="stat-label">SPD</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    })}
                </div>
        }
    </div>
}

export default FIFA2022;