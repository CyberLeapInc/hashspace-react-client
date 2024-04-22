'use client'
import './pages.css';
import {Button} from "antd";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import Image from "next/image";
import { Collapse, Space } from 'antd';
import {useState} from "react";
import ProImage from '../../public/pro-round.png';
import CountImage from '../../public/count-round.png';
import SafeImage from '../../public/safe-round.png'

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const questionList = [{
    title: 'HashSpace是如何运作的？',
    text: '首先您需要在HashSpace选择一个算力合约，然后支付算力费用及电费。费用支付完成后，矿场合作方将会为您解决后续的配置上架、电力管理、矿场运维等复杂流程。您只需要在购买后设置您想要使用的矿池，并填写您在该矿池的账号，即可享受一站式的便捷服务，坐收挖矿收益。\n',
    index: 1,
},{
    title: 'HashSpace支持哪些支付方式？',
    text: '目前支持BTC，ETH，USDT（ERC20），USDC（ERC20）支付。',
    index: 2,
},{
    title: 'HashSpace所售卖的算力对应的矿机属于谁？',
    text: 'HashSpace平台售卖的算力归HashSpace所有，HashSpace为客户提供购买算力技术服务。当前我们的矿机托管在美国德州的矿场，未来将会有更多电力资源丰富的矿场加入进来。',
    index: 3,
},{
    title: 'HashSpace的矿场在哪里？',
    text: 'HashSpace为算力购买方提供算力购买的技术服务，当前合约中的矿机托管于美国德州的矿场。德州拥有独立的电网，丰富的电力资源，加上友好的政策环境，是不错的挖矿选址',
    index: 4,
},{
    title: '电费如何计算？可以直接从收益中扣除吗？除去电费外还有哪些额外费用？',
    text: '当前提供的合约，挖矿电费为$0.1KW/h。电费可能会根据市场情况有所调整，若有调整将另行通知。电费不能从收益中扣除，您需要手动缴纳电费，且需要维持账户内的电费余额可用日期在1天以上。\n \n 在HashSpace购买算力后，您只需要支付电费即可进行完整的挖矿，无需缴纳任何其他费用。',
    index: 5,
},{
    title: '你们的云算力和其他家产品有什么不同？',
    text: 'HashSpace相比现有的同类型产品，显著的特点有3个。其一，我们通过严格的标准筛选可信任的算力出租方，为客户提供稳定的算力服务。其二，我们的算力产品可以任由用户选择其偏好的协议兼容的矿池，而非强行绑定某个特定的矿池。这种模式下用户可以不必在我们的产品和自己喜欢的矿池之间二选一，给了用户更多、更灵活的选择。其三，我们将矿机进行云计算的全部过程交由您自行设置的矿池负责，将矿机硬件层面的管理与维护交由专业审核筛选过的的矿场管理团队，这意味着我们将比其他同时身兼多重职责的平台要更加专业，更加透明。',
    index: 6,
},{
    title: '可以保证机器一直运行吗？',
    text: 'HashSpace通过出售算力在一定时间内的使用权让客户体验最真实的挖矿过程。矿机挖矿的过程，高度依赖矿场电力供应、网络供应、矿池稳定性等因素。当出现断电、断网、矿场检修以及高温、飓风等自然灾害时，会出现暂时停止运行的情况。因为德州放松管制的电力特性，电力供应情况均可以在ERCOT（Electric Reliability Council of Texas）查询。',
    index: 7,
},{
    title: '购买云算力需要实名认证吗？',
    text: '为保障您的账户安全和权益，我们要求全体购买HashSpace云算力的用户都进行完备、完善的KYC实名认证。用户在进行实名认证后方可继续购买算力并投入使用。',
    index: 8,
},{
    title: '购买了云算力之后可以退款吗？',
    text: '用户在HashSpace全线产品购买、使用过程中所缴交的费用均不可退还。我们会在明显的位置做明确的提醒，请您认真、仔细地阅读我们的服务条款及免责声明。如在购买及使用过程中有任何疑问，您可以随时联系我们。 （邮箱：contact@hashingnow.com，Telegram：https://t.me/hashingnow )',
    index: 9,
},{
    title: '我可以设置任何我想用的矿池吗？',
    text: '我们支持任何跟我们的矿工代理协议兼容的矿池。目前您可以选择使用F2Pool。',
    index: 10,
},{
    title: '如果我在购买算力后没有及时配置矿池信息会怎么样？',
    text: '如您在购买算力后没有及时配置矿池信息的话，其合约中所包含的时间仍然会正常流失，对此HashSpace不承担责任，也不会赔偿相应损失。请您在购买后一定要认真填写您的矿池及账号信息，并在配置完毕后仔细核对。',
    index: 11,
},{
    title: '谁来支付挖矿收益？会在什么时候支付？如何查看挖矿收益？',
    text: 'HashSpace只提供算力使用权的销售服务，挖矿收益将由您设置的矿池给您支付，更多收益发放等问题请您联系您设置的矿池客户服务人员。',
    index: 12,
},{
    title: 'HashSpace是如何筛选算力提供方的？',
    text: '为了给用户更好的体验，我们对算力提供方进行严格的筛选，包括但不限于企业背景调查，矿场实地考察，矿场所在地政策研究，算力提供方沟通体验，矿场运维能力调查等。',
    index: 13,
},{
    title: '修改矿池设置后会多久生效？',
    text: '修改矿池设置后，您的配置会在下一个UTC 0:00左右开始生效。期间若出现多次矿池设置的更改，将以最后的设置为准。',
    index: 14,
},{
    title: '我需要在多久内设置上矿池？',
    text: '若您购买的是预售合约，您只需要在合约开始前设置上矿池即可。若您购买的是现货合约，算力会在您购买当天后的第二个UTC 0:00左右开始运行。为了避免您的损失，请在此时间之前完成设置。',
    index: 15,
}]

export default function Home() {
    const [questionOpen, setQuestionOpen] = useState(0);
    return (
    <main className="dd">
      <div className=''>
          <div className="banner">
              <div className='container-my'>
                  <div className="title">
                      Expanding your<br/>
                      crypto space.
                  </div>
                  <div className="text">It's a bit of a long It's a bit of a long It's a bit of a long It's a bit of a
                      <br/>long It's a bit of a long It's a bit of a long It's a bit of a long
                  </div>
                  <div className="button-zone">
                      <Button style={{height: '50px',marginRight: '20px',backgroundColor: "black"}} type="primary" shape="round" size="large">1123123</Button>
                      <Button style={{height: '50px'}} type="default" shape="round"  size="large">123121</Button>
                  </div>
              </div>
          </div>
          <div className="middle">
              <div className="container-my">
                  <div className="title2">为什么选择我们</div>
                  <div className="cardlist">
                      <div className="card">
                          <div className="card-image">
                              <Image src={ProImage} alt="pro"></Image>
                          </div>
                          <div className="card-title">专业团队</div>
                          <div
                              className="card-text">真实可信的矿场资源，专业团队筛选，遍布全球
                          </div>
                      </div>
                      <div className="card">
                          <div className="card-image">
                              <Image src={CountImage} alt="pro"></Image>
                          </div>
                          <div className="card-title">专业团队</div>
                          <div
                              className="card-text">自己选择矿池、自己支付电费、矿池直接支付收益、自己选择收款类型
                          </div>
                      </div>
                      <div className="card">
                          <div className="card-image">
                              <Image src={SafeImage} alt="pro"></Image>
                          </div>
                          <div className="card-title">专业团队</div>
                          <div
                              className="card-text">矿场位于美国，合规的电力系统
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          <div style={{marginBottom: '40px', backgroundColor: "white"}}>
              <div className="container-my">
                  <div className="question-title">常见问题</div>
                  {
                      questionList && questionList.map((item) => (
                          <Collapsible open={questionOpen === item.index} key={item.index} onClick={() => {
                              if (questionOpen === item.index) {
                                  setQuestionOpen(0)
                              } else {
                                  setQuestionOpen(item.index)
                              }
                          }} className={questionOpen === item.index ? 'grayquestionopen' : 'grayquestion'}>
                              <CollapsibleTrigger className="collapse-title">
                                  <span>
                                      <div className="collapse-span">{item.index}</div>
                                      {item.title}
                                  </span>
                                  <span className={item.index === questionOpen ? "uparrowimg" : "uparrowimg"}/>
                              </CollapsibleTrigger>
                              <CollapsibleContent className="collapse-text">
                                  {item.text}
                              </CollapsibleContent>
                          </Collapsible>
                      ))
                  }
              </div>

          </div>
      </div>
    </main>
    );
}
