import React, { memo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Header } from '@buffetjs/custom';
import { BackHeader } from 'strapi-helper-plugin';

import Container from '../../components/container';
import VersionList from '../VersionList';
import { collectionName } from '../../utils/collection';

const HomePage = ({ match: { params } }) => {
  const { collectionId, entryId } = params;

  const history = useHistory();
  const [loading, setLoading] = useState(true);

  return (
    <>
      <BackHeader onClick={() => history.go(-1)} />
      <Container>
        <Header
          title={{ label: `${collectionName(collectionId)} ${entryId}` }}
          content="Select a version to compare and restore"
          isLoading={loading}
        />
        <VersionList
          setLoading={setLoading}
          collectionId={collectionId}
          entryId={entryId}
        />
      </Container>
    </>
  );
};

export default memo(HomePage);
