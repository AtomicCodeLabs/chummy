import styled from 'styled-components';
import { NODE } from '../../constants/sizes';

export const SearchContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const Label = styled.label`
  font-size: 0.75rem;
`;

export const Input = styled.input`
  background-color: lightblue;
  height: ${NODE.HEIGHT}px;
`;

export const Select = styled.select`
  background-color: lightcyan;
`;

export const Option = styled.option`
  background-color: lightgreen;
  height: ${NODE.HEIGHT}px;
`;
