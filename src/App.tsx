import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import DataBase from './page/DataBase';
import DataSet from './page/Dataset';
import Visualization from './page/Visualization';
import PannelPreview from './page/PannelPreview';
import NotFound from './page/NotFound';
import { PathNames, pathInfos } from './configs/routerConfig';
import { whoAmI } from './api/user';

interface LoginMsgCtx {
  isLoading: boolean,
  loginMsg: null | { id: number, loginName: string },
  changeLoginMsg: (newMsg: any) => void
  changeIsLoading: (newStat: boolean) => void
}
export const loginMsgCtx = React.createContext<LoginMsgCtx>({
  isLoading: false,
  loginMsg: null,
  changeLoginMsg: (o) => { },
  changeIsLoading: (l) => { }
});

const App: React.FC = () => {
  const [loginMsg, setLoginMsg] = useState<null | any>(null);
  const handleChangeLoginMsg = useCallback((newMsg: any) => {
    setLoginMsg(newMsg);
  }, []);
  const [isLoading, setIsLoading] = useState(false);
  const handleChangeIsLoading = useCallback((newStat: boolean) => {
    setIsLoading(newStat);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    whoAmI().then(r => {
      console.log('who', r);
      if (typeof r.data.data !== "string") {
        setLoginMsg(r.data.data);
      }
      setIsLoading(false);
    })
  }, []);

  return (
    <loginMsgCtx.Provider value={{
      loginMsg,
      isLoading,
      changeLoginMsg: handleChangeLoginMsg,
      changeIsLoading: handleChangeIsLoading,
    }}>
      <Router>
        <Switch>
          <Route path='/' exact component={DataBase} />
          <Route path={'/' + pathInfos[0].pathName} component={DataBase} />
          <Route path={'/' + pathInfos[1].pathName} component={DataSet} />
          <Route path={'/' + PathNames.visualPreview} component={PannelPreview} />
          <Route path={'/' + pathInfos[2].pathName} component={Visualization} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    </loginMsgCtx.Provider >
  );
}


// function Test(props: any) {
//   return <div>{props.x}</div>
// }

// function App() {
//   console.log('render');

//   const r = useRef<number>(1);

//   const [, force] = useState<any>({});

//   return <div>
//     <button onClick={() => {
//       r.current++;
//       force({})
//     }}>click</button>
//     <Test x={r.current} />
//   </div>
// }


export default App;
