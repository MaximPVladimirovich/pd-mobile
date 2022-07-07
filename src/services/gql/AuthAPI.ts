import gql from 'graphql-tag';

export const USERNAME_CHECK = gql`
mutation checkUsername($username: String!) {
  checkUsername(username: $username) {
    username
    available
  }
}
`;

export const REGISTER = gql`
  mutation Register($username: String!, $email: String!, $password: String!, $sso: String, $sig: String) {
    register(username: $username, email: $email, password: $password, sso: $sso, sig: $sig) {
      id
      discourse_payload
    }
  }
`;

export const ME = gql`
  query Me {
    me {
      id
      username
      email
    }
  }
`;
