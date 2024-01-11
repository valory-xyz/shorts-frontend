import { Typography } from 'antd';
import styled from 'styled-components';

const { Title } = Typography;

const TypographyContainer = styled(Typography)`
  max-width: 700px;
  margin: 0 auto;
  h1.ant-typography {
    text-align: center;
  }
  ol.custom-list {
    list-style-type: lower-alpha;
    padding-left: 24px;
  }
`;

export const Disclaimer = () => (
  <TypographyContainer>
    <Title>Disclaimer</Title>

    <ol>
      <li>
        This App is owned by and operated by
        {' '}
        <a href="https://valory.xyz" target="_blank" rel="noopener noreferrer">
          Valory AG
        </a>
        .
      </li>
      <li>
        THIS APP IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE,&quot; AT YOUR OWN RISK, AND
        WITHOUT WARRANTIES OF ANY KIND. Valory AG will not be liable for any loss,
        whether such loss is direct, indirect, special or consequential, suffered
        by any party as a result of their use of this app.
      </li>
      <li>
        This App is for research purposes only. It uses several models including:
        <ol className="custom-list">
          <li>
            Stable Video Diffusion, which is licensed under the Stable Video
            Diffusion Research License, Copyright © Stability AI Ltd. All Rights
            Reserved.
          </li>
          <li>
            GPT-3.5 and DALL·E 3, Copyright © Open AI.
          </li>
          <li>
            Musicgen, which is licensed under Apache 2.0 and MIT License,
            Copyright © Meta.
          </li>
          <li>
            Tortoise-tts, which has no stated license restrictions, Copyright ©
            James Betker AKA &quot;neonbjb&quot;.
          </li>
        </ol>
      </li>
      <li>
        By accessing this app, you represent and warrant:
        <ol className="custom-list">
          <li>
            that you are of legal age and that you will comply with any laws
            applicable to you and not engage in any illegal activities;
          </li>
          <li>
            that you are minting shorts.wtf NFTs and that they do not represent
            consideration for past or future services;
          </li>
          <li>
            that you, the country you are a resident of and your wallet address is
            not on any sanctions lists maintained by the United Nations,
            Switzerland, the EU, UK or the US;
          </li>
          <li>
            that you are responsible for any tax obligations arising out of the
            interaction with this app.
          </li>
        </ol>
      </li>
      <li>
        None of the information available on this app, or made otherwise available
        to you in relation to its use, constitutes any legal, tax, financial or
        other advice. Where in doubt as to the action you should take, please
        consult your own legal, financial, tax or other professional advisors.
      </li>
    </ol>
  </TypographyContainer>
);
