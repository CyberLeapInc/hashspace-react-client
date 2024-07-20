'use client'
import './pages.css';
import {Button} from "antd";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import Image from "next/image";
import {useContext, useEffect, useState} from "react";
import ProImage from '../../public/pro-round.png';
import CountImage from '../../public/count-round.png';
import SafeImage from '../../public/safe-round.png'
import css from './page.module.css'
import {MyContext} from "@/service/context";
import {cn} from "@/lib/utils";
import {useTranslations} from 'next-intl';
import langCn from '../../messages/zh-CN.json'
import langEn from '../../messages/en.json'

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;
let language = 'zh-CN';
let questionList: any[] = [];
if (typeof window !== 'undefined') {
    language = window.localStorage.getItem('language') || 'zh-CN';
    if (language === 'zh-CN') {
        questionList = langCn.home.questions
    } else if (language === 'en') {
        questionList = langEn.home.questions
    } else {
        questionList = []
    }
    for (let i = 0; i < questionList.length; i++) {
        // 在这里加一个key
        questionList[i].index = i + 1;
    }
} else {
    questionList = [];
}

export default function Home() {
    const t = useTranslations('home');
    const [questionOpen, setQuestionOpen] = useState(0);
    const {state, dispatch} = useContext(MyContext)
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])


    return (
    <main>
      <div className=''>
          <div className={state.isMobile? css.mobileBanner : css.banner}>
              <div style={{
                  maxWidth: '1200px',
                  margin: '0 auto'
              }}>
                  <div className={cn(css.title, state.isMobile ? css.mobileTitle : css.pcTitle)}>
                      Expanding your<br/>
                      crypto space.
                  </div>
              </div>

          </div>
          <div className={css.middle}>
              <div className="container-my">
                  <div className={cn(css.cardlist, state.isMobile? css.mobileCardList: '')}>
                      <div className={css.card}>
                          <div className={cn(css.cardImage, state.isMobile? css.centerCardImage : '')}>
                              <Image src={ProImage} alt="pro"></Image>
                          </div>
                          <div className="card-title" style={{fontSize: state.isMobile? '16px' : '20px'}}>{t('cardProfessionalTitle')}</div>
                          <div
                              className="card-text">{t('cardProfessionalText')}
                          </div>
                      </div>
                      <div className={css.card}>
                          <div className={cn(css.cardImage, state.isMobile? css.centerCardImage : '')}>
                              <Image src={CountImage} alt="pro"></Image>
                          </div>
                          <div className="card-title" style={{fontSize: state.isMobile? '16px' : '20px'}}>{t('cardAutonomyTitle')}</div>
                          <div
                              className="card-text">{t('cardAutonomyText')}
                          </div>
                      </div>
                      <div className={css.card}>
                          <div className={cn(css.cardImage, state.isMobile? css.centerCardImage : '')}>
                              <Image src={SafeImage} alt="pro"></Image>
                          </div>
                          <div className="card-title" style={{fontSize: state.isMobile? '16px' : '20px'}}>{t('cardSecurityTitle')}</div>
                          <div
                              className="card-text">{t('cardSecurityText')}
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          <div style={{paddingBottom: '40px', backgroundColor: "white"}}  id={'question'}>
              <div className="container-my" style={{padding: state.isMobile ? '0 12px' : ''}}>
                  <div className={cn(css.questionTitle, state.isMobile && css.mobileQuestionTitle)}>{t('questionTitle')} <span style={{fontWeight: 500}}>Q&A</span></div>
                  <>
                      {
                          questionList&&isClient && questionList.map((item) => (
                              <Collapsible open={questionOpen === item.index} key={item.index} onClick={() => {
                                  if (questionOpen === item.index) {
                                      setQuestionOpen(0)
                                  } else {
                                      setQuestionOpen(item.index)
                                  }
                              }} style={{transition: 'all 0.3s'}} className={questionOpen === item.index ? 'grayquestionopen' : 'grayquestion'}>
                                  <CollapsibleTrigger className="collapse-title">
                                  <span style={{maxWidth: '80%', display: 'flex', alignItems: 'center'}}>
                                      <div >{item.title}</div>
                                  </span>
                                      <span className={item.index === questionOpen ? "downarrowimg" : "uparrowimg"} style={{margin: state.isMobile?'0' : ''}}/>
                                  </CollapsibleTrigger>
                                  <CollapsibleContent className="collapse-text">
                                      {item.text}
                                  </CollapsibleContent>
                              </Collapsible>
                          ))
                      }
                      </>
              </div>

          </div>
      </div>
    </main>
    );
}
