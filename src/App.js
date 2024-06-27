import './App.css';
import { DEFAULT_WORKBOOK_DATA } from "./UniverSheet/data.ts"
import UniverSheet from "./UniverSheet/UniverSheet.tsx"
import {useRef} from "react"

function App() {
  console.log(DEFAULT_WORKBOOK_DATA)
  const univerRef = useRef();

  const onSaveData = () => {
    console.log(univerRef.current?.getData());
    let result = univerRef.current?.getData().sheets["sheet-01"].cellData
    console.log(result);
    let keys = ['cn', 'en', 'de' , "fi", 'fr','jp', 'ko', 'nl', 'pl', "sv"];
    let parsedData = pareResult(result, keys, "cn");
    console.log(parsedData);
  }

  const pareResult = (result, languages, key) => {
    let res = {}
    let keyindex = languages.indexOf(key)
    languages.forEach((language) => {
      Object.assign(res, {[language]: {}})
    });
    Object.values(result).forEach((value) => {
        Object.keys(res).forEach((language, index) => {
          Object.assign(res[language], {[value[keyindex]?.v]: value[index]?.v})
        })
    })
    console.log(res);
  }

  return (
    <div className="App">
      <button onClick={onSaveData}>保存</button>
      <UniverSheet data={DEFAULT_WORKBOOK_DATA} ref={univerRef}/>
    </div>
  );
}

export default App;
