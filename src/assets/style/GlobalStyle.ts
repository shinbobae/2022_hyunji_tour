import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed,
  figure, figcaption, footer, header, hgroup,
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    vertical-align: baseline;
  }

  /* HTML5 display-role reset for older browsers */
  article, aside, details, figcaption, figure,
  footer, header, hgroup, menu, nav, section {
    display: block;
  }

  body {
    font-family: 'Poppins';
  }

  ol, ul {
    list-style: none;
  }

  blockquote, q {
    quotes: none;
  }

  blockquote:before, blockquote:after,
  q:before, q:after {
    content: '';
    content: none;
  }

  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
  
  a {text-decoration: none}
  
  
  .ant-table-cell {vertical-align: middle}
`;

interface RowPropsType {
    flexWrap?: boolean;
    direction?: string;
    justify?: string;
    align?: string;
    fullHeight?: boolean;
    fullWidth?: boolean;
    width?: string;
    height?: string;
    padding?: string;
}
export const Row = styled.div<RowPropsType>`
    display: flex;
    flex-wrap: ${(props) => props.flexWrap && 'wrap'};
    flex-direction: ${(props) => props.direction && props.direction};
    justify-content: ${(props) =>
        props.justify === 'between'
            ? 'space-between'
            : props.justify === 'center'
            ? 'center'
            : props.justify === 'around'
            ? 'space-around'
            : props.justify};
    align-items: ${(props) => (props.align === 'center' ? 'center' : props.align === 'end' ? 'flex-end' : props.align)};
    width: ${(props) => (props.fullWidth ? `100%` : props.width && props.width)};
    height: ${(props) => (props.fullHeight ? '100%' : props.height && props.height)};
    padding: ${(props) => props.padding && props.padding};
`;
