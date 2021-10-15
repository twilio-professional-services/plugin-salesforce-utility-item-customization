import styled from 'react-emotion';

export const Container = styled("div")`
    flex: 1 1 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    ${(props) => props.theme.CRMContainer.Placeholder.Container}
`;


export const FirstLineContainer = styled("div")`
    border-style: solid;
    border-width: 0px 0px 4px 0px;
    border-color: ${(props) => props.theme.colors.flexBlueColor};
`;

export const FirstLine = styled("div")`
    font-size: 10px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin: 0px 12px 4px 12px;
`;


export const Grid = styled("div")`
    display: flex;
    padding: 20px 16px;
    width: 100%;
    margin-top: 0;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 0;
    height: auto;
    box-sizing: border-box;
    flex: 0 0 auto;
    > * {
        flex: 1 1 25%;
    }
    > * + * {
        margin-left: 16px;
    }
  ${(props) => props.theme.QueuesStats.TilesGrid}
`;