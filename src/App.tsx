// eslint-disable-all react-hooks/exhaustive-deps
import { useEffect, useState } from 'react';
import { Badge, Button, Col, Input, notification, Row, Switch, Typography } from 'antd';
import { PlayCircleOutlined, StopFilled, CopyOutlined, LinkOutlined, DownloadOutlined } from '@ant-design/icons';
import logo from './logo.png';
import 'antd/dist/antd.css';
import './App.css';

const { Keypair } = require("@solana/web3.js");
const { Text, Link } = Typography;

function App() {
  const [finish, setFinish] = useState(true);
  const [pubkeyFound, setPubkeyFound] = useState('-');
  const [secretKey, setSecretKey] = useState('');

  useEffect(() => {
    let count = 1;
    let finishInfinity = finish;
    const loop = () => {
      if(!finishInfinity) {
        let account = Keypair.generate();
        let pubkey = account.publicKey.toBase58();
        for (let i = 0; i < search.length; i++) {
          let prefix = search[i];
          let prefix_found = pubkey.substring(0, prefix.length);
          if(!caseSensitive) {
            prefix_found = prefix_found.toLowerCase();
          }
          if(prefix === prefix_found) {
            setFinish(true);
            finishInfinity = true;
            setPubkeyFound(pubkey);
            setSecretKey(`[${account.secretKey.toString()}]`);
            break;
          }
        }
        if(count % 10000 === 0) {
          console.log(count);
        }
        count++;
      }

      // at the end, start next async loop if condition still hold true
      if (!finishInfinity) setTimeout(loop, 0);
    }

    // kickstart the loop
    if(!finishInfinity) {
      loop();
    }
  }, [finish]);

  const start = () => {
    console.log('start');
    if(search.length > 0) {
      setPubkeyFound('-');
      setFinish(false);
    }
  }
  
  /* const stop = () => {
    console.log('stop');
    setFinish(true);

  } */

  const [input, setInput] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const result : string[] = [];
  const [search, setSearch] = useState(result);
  const add = () => {
    if(input !== '' && !search.includes(input)) {
      setSearch([...search, input]);
      setInput('');
    }
  }
  const remove = (item_rm: string) => {
    setSearch([...search, input]);
    setSearch(search.filter(item => item !== item_rm));
  }
  const onChangeCaseSensitive = (e: any) => {
    setCaseSensitive(e);
  }
  function SearchList(props: any) {
    const search = props.search;
    return search.map((item: any) =>
      <>
      <div 
        style={{display: 'inline-block', margin:'5px', cursor: 'pointer' }}
        onClick={() => remove(item)}>
        <Badge
        className="site-badge-count-109"
        count={`x ${item}`}
        style={{ backgroundColor: '#52c41a' }}
        />
      </div>
      </>
    );
  }

  const openNotification = () => {
    notification.open({
      message: 'Successfully copied'
    });
  };

  const downloadKeypair = () => {
    const element = document.createElement("a");
    const file = new Blob([secretKey], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `keypair-${pubkeyFound}.json`;
    document.body.appendChild(element);
    element.click();
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Search Pretty Pubkey
        </p>
        <Row>
          <Col span={24}>
            <Input.Group compact style={{marginBottom: '5px', minWidth: '400px'}}>
              <Input
                placeholder="Preferred initial letter"
                size="large"
                value={input || ''}
                onChange={e => setInput(e.target.value)}
                style={{ width: 'calc(100% - 200px)', textAlign: 'left' }}
                defaultValue=""
              />
              <Button type="primary" onClick={add} size="large">Add</Button>
            </Input.Group>
          </Col>
          <Col span={24} style={{marginBottom: '10px' }}>
            <SearchList search={search}/>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{margin: '5px'}}>
            <Switch 
               style={{marginRight: '5px'}}
              defaultChecked={false} 
              onChange={onChangeCaseSensitive} />
            <Text style={{color: '#fff', fontSize: '14px', marginTop: '20px'}}>
              Case Sensitive
            </Text>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Button style={{marginRight: '10px' }} 
              onClick={start} type="primary" shape="round" icon={<PlayCircleOutlined />} 
              size='large'
              loading={!finish}>
              Start
            </Button>
          </Col>
          {/* <Col span={12}>
            <Button style={{marginLeft: '10px'}} onClick={stop} type="primary" danger shape="round" icon={<StopFilled />} size='large'>
              Stop
            </Button>
          </Col> */}
        </Row>
        <Text style={{color: '#fff', fontSize: '14px', marginTop: '20px'}}>Public Key Found</Text>
        <Text style={{color: '#fff', fontSize: '18px', marginTop: '20px', marginBottom: '20px'}}>
          { pubkeyFound !== '-' &&
            <>
              <CopyOutlined onClick={() => {navigator.clipboard.writeText(pubkeyFound); openNotification();}} style={{marginRight: '10px'}}/>
              <Link style={{marginRight: '10px'}} href={`https://explorer.solana.com/address/${pubkeyFound}`} target="_blank">
                <LinkOutlined />
              </Link> 
            </>
          }
          {pubkeyFound}
        </Text>
        <Row>
          <Col span={24}>
            { pubkeyFound !== '-' &&
              <>
                <Button 
                  style={{marginBottom: '120px', marginTop: '20px'}}
                  type="primary" shape="round" icon={<DownloadOutlined />} 
                  size='large'
                  onClick={downloadKeypair}>
                  Download Keypair
                </Button>
              </>
            }
          </Col>
        </Row>
      </header>
    </div>
  );
}

export default App;
