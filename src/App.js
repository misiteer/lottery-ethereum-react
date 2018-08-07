import React, {Component} from 'react';
import {
    Message,
    Container,
    Icon,
    Card,
    Image,
    Statistic,
    Button,
    Label,
    Reveal
} from 'semantic-ui-react'
import web3 from './web3';
import lottery from './lottery';

//react的一个组件
class App extends Component {

    state = {
        manager: '',
        playersCount: 0,
        balance: 0,
        loading: false,
        showbutton: 'none'
    };

    async componentDidMount() {
        const address = await lottery.methods.manager().call();
        this.setState({manager: address});
        const playersCount = await lottery.methods.getPlayersCount().call();
        const balance = await lottery.methods.getBalance().call();
        this.setState({playersCount: playersCount});
        this.setState({balance: web3.utils.fromWei(balance, 'ether')});

        const accounts = await web3.eth.getAccounts();
        if (accounts[0] === address) {
            //现在登录的是管理员
            this.setState({showbutton: 'inline'});
        } else {
            //这就说明不是管理员
            this.setState({showbutton: 'none'});
        }
    }

    enter = async () => {
        this.setState({loading: true});
        //获取账户
        const accounts = await web3.eth.getAccounts();
        //拿着彩票智能合约调用enter方法
        await lottery.methods.enter().send({
            from: accounts[0],
            value: '1000000000000000000'
        });
        this.setState({loading: false});
        window.location.reload(true);
    };

    pickWinner = async () => {
        this.setState({loading: true});
        //获取账户
        const accounts = await web3.eth.getAccounts();
        //拿着彩票智能合约调用pickWinner方法
        await  lottery.methods.pickWinner().send({
            from: accounts[0]
        });
        this.setState({loading: false});
        window.location.reload(true);
    };

    render() {
        console.log(web3.version);
        return (
            <div>
                <Container>
                    <br/>
                    <Message info>
                        <Message.Header>熊猫区块链博彩</Message.Header>
                        <p>买一赚三,不买也过来瞧瞧看看啦</p>
                    </Message>

                    <Card.Group>
                        {/*第一个*/}
                        <Card>
                            <Card.Content>

                                <Image floated='right' size='mini' src='/images/logo.jpg'/>

                                <Card.Header>七星彩</Card.Header>
                                <Card.Meta>
                                    <p>管理员地址:</p>
                                    <Label size='mini'>
                                        {this.state.manager}
                                    </Label>
                                </Card.Meta>
                                <Card.Description>
                                    每周三晚上8:00准时开奖
                                </Card.Description>
                            </Card.Content>

                            <Card.Content extra>
                                <a>
                                    <Icon name='user'/>
                                    {this.state.playersCount}人参加
                                </a>
                            </Card.Content>

                            <Card.Content extra>
                                <Statistic color='pink'>
                                    <Statistic.Value>{this.state.balance} ether</Statistic.Value>
                                </Statistic>
                            </Card.Content>

                            <Button animated='fade' onClick={this.enter}
                                    loading={this.state.loading}
                                    disabled={this.state.loading}>
                                <Button.Content visible>有投注就有希望</Button.Content>
                                <Button.Content hidden>犹豫是钱最大的敌人</Button.Content>
                            </Button>

                            <Button color='yellow' style={{display: this.state.showbutton}}
                                    onClick={this.pickWinner}>开奖</Button>
                            <Button color='red' style={{display: this.state.showbutton}}>退钱</Button>
                        </Card>

                    </Card.Group>
                </Container>
            </div>
        );
    }
}

export default App;
