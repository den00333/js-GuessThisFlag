import { useState, useEffect } from "react";

const Home = () => {

    const [flagGuess, setFlagGuess] = useState('');
    const [resultMsg, setResultMsg] = useState('');
    const [flagData, setFlagData] = useState({ img: '', name: '' });
    const [resultColor, setResultColor] = useState('');

    const [lives, setLives] = useState(3);
    const [score, setScore] = useState(0);
    const [sirit, setSirit] = useState([]);
    const [underline, setUnderline] = useState([]);
    const [existingNum, setExistingNum] = useState([]);
    const [newNums, setNewNums] = useState([]);

    const [flagMsg, setFlagMsg] = useState();
    const [disable, setDisable] = useState(false)
    


    const handleInput = (e) =>{
        setFlagGuess(e.target.value);
    } 

    const fetchRandomFlag = () => {
        fetch('https://restcountries.com/v3.1/all')
            .then(res => res.json())
            .then(data => {
                const randomIndex = Math.floor(Math.random() * data.length);
                const flagUrl = data[randomIndex].flags.png;
                const countryName = data[randomIndex].name.common;
                setFlagData({ img: flagUrl, name: countryName });
                setFlagMsg(countryName);
                let n = countryName.toUpperCase().split('');
                setSirit(n);
                
                let tempArr = [];
                for(let i = 0; i < n.length; i++){
                    if(n[i] == ' ' ){
                        tempArr[i] = '1';
                    }else{
                        tempArr[i] = '\u00A0';
                    }
                }
                setUnderline(tempArr);
                setExistingNum([]);
                setDisable(false);
            })
        .catch(error => console.log('Error fetching data: ', error));
        setLives(3);

    }

    const generateLetter = () => {
        let nGoal = 2;
        if(sirit.length-1 <= 9){
            nGoal = 1;
        }else{
            nGoal = 3;
        }
        let iterateThreeTimes = 0;
        let threeNum = [];
        while(iterateThreeTimes != nGoal || existingNum.length-1 >= sirit.length-2){
            let randomNumber = Math.floor(Math.random() * sirit.length);
            
            while(existingNum.includes(randomNumber)){
                randomNumber = Math.floor(Math.random() * sirit.length);
            }
            if(!existingNum.includes(randomNumber)){
                threeNum.push(randomNumber); 
            }
            iterateThreeTimes += 1;
        }
        setNewNums(threeNum);
        setExistingNum([...existingNum, ...threeNum]);
    }

    const showLetters = () => {
        const siritArr = [...sirit];
        let underlineArr = [...underline];
        for(let i = 0; i<newNums.length; i++){
            underlineArr[newNums[i]] = siritArr[newNums[i]];
        }

        setUnderline([...underlineArr]);
    }


    const checkGuess = ()=> {
        try{
            const userGuess = flagGuess.trim().toLowerCase();
            const correctAnswer = flagData.name.toLowerCase();

            if (userGuess == correctAnswer) {
                setResultMsg('Correct!');
                setResultColor('text-green-700');
                fetchRandomFlag();
                setScore(prevScore => {
                    return prevScore + 1;
                });
                
            } else {

                
                
                if(lives <= 0){
                    setResultMsg(`The answer was ${flagMsg}`);
                    setResultColor('text-red-700');
                    setDisable(true)
                    setTimeout(() => {
                        setResultMsg('');
                        fetchRandomFlag();
                    }, 2500);

                    

                }else{
                    setResultMsg('Incorrect. Try again.');
                    setResultColor('text-red-700');
                    if(!(existingNum.length-1 >= sirit.length-2)){
                        generateLetter();
                    }
                    showLetters();

                    setLives(prevLives => {
                        return prevLives - 1;
                    })

                    setTimeout(() => {
                        setResultMsg('');
                    }, 1500);
                }
            }
            setFlagGuess('');
            
        }catch(error){
            console.log('error');
        }
        
    }

    useEffect(()=>{
        fetchRandomFlag();
    }, []);

    return(
        
        <main className="flex justify-center w-full h-auto bg-emerald-400">

            <div className=" p-5">
                    <div className="w-auto h-auto p-1 flex items-center justify-center">
                        <p className="text-cyan-900 font-bold text-2xl">GUESS THE FLAG</p>
                    </div>
                    <div className="w-full h-auto p-1 flex items-center justify-center">
                       
                        <p className="text-xl mx-2">Score: {score}</p>
                        <p className="text-xl mx-2">Lives: {lives}</p>
                    </div>
                    <div className="w-full h-auto flex items-center justify-center py-5">
                        <img src={flagData.img} alt="flag" className="w-18 h-18"/>
                    </div>

                    <div className="flex justify-center">
                        {underline.map((value, index) => (
                            <span className={`font-bold text-2xl ${value == '1' ? '' : 'underline'} mx-2`} key={index}> {value == '1' ? '\u00A0' : value} </span>
                        ))}
                    </div>    

                    <form action="" onSubmit={(e)=>{e.preventDefault(); checkGuess();}} className="w-full h-auto p-2 text-center bg-slate-400">
                        <p className={`${resultColor} font-semibold text-xl`}>{resultMsg}</p>
                        <input type="text" onChange={handleInput} disabled={disable} required value={flagGuess} placeholder="Enter the Flag Name" className="w-4/5 p-2 bg-transparent outline-0 border-b-2 border-black placeholder-black text-2xl"/>
                        <button type="submit" disabled={disable} className="w-4/5 text-2xl text-white font-semibold py-3 my-2 bg-cyan-800 rounded-2xl">Submit</button>
                        <div className="w-full py-2 flex items-center justify-center">
                            <button onClick={fetchRandomFlag} disabled={disable} className="w-3/5 flex items-center justify-center text-2xl text-white font-semibold py-3 bg-cyan-600 rounded-2xl">PASS</button>
                        </div>
                    </form>
                    
            </div>
        </main>
    )
}

export default Home;