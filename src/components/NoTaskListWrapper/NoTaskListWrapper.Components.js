import styled from 'react-emotion';

export const Container = styled("div")`
    flex: 1 1 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    ${(props) => props.theme.AgentDesktopView.ContentSplitter}
`;

