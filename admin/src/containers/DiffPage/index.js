import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Header } from '@buffetjs/custom';
import ReactDiffViewer from 'react-diff-viewer';
import { request, BackHeader } from 'strapi-helper-plugin';
import { cleanData } from 'strapi-plugin-content-manager/admin/src/containers/EditViewDataManagerProvider/utils';
import useSWR from 'swr';

import { getComparisonString, normalizeObject } from './helper';

import Container from '../../components/container';
import pluginId from '../../pluginId';
import { collectionName } from '../../utils/collection';

const cleanVersion = (version, config) => {
  if (!version || !config) return null;
  const { contentType, components } = config;
  const cleaned = cleanData(version, contentType, components);
  return normalizeObject(cleaned);
};

async function fetchVersion(collectionId, entryId, versionId) {
  const urlPath = `/${pluginId}/${collectionId}/${entryId || '1'}/${versionId}`;
  const version = await request(urlPath, { method: 'GET' });
  return version.content;
}

function useVersion(collectionId, entryId, versionId) {
  const { data, error } = useSWR([collectionId, entryId, versionId], fetchVersion);
  return {
    data,
    error,
    isLoading: !data && !error,
  };
}

function useCurrentVersion(collectionId, entryId) {
  const fetchCurrentVersion = async () =>
    await request(`/content-manager/collection-types/${collectionId}/${entryId}`, { method: 'GET' });

  const [version, setVersion] = useState(null);
  const [error, setError] = useState(null);
  if (!version) {
    fetchCurrentVersion(collectionId, entryId)
      .then(setVersion)
      .catch(setError);
  }
  return {
    data: version,
    error,
  };
}

function useConfiguration(collectionId) {
  const fetchConfiguration = async () => {
    const [configuration, contentTypes] = await Promise.all([
      request(`/content-manager/content-types/${collectionId}/configuration`, { method: 'GET' }),
      request('/content-manager/content-types', { method: 'GET' }),
    ]);
    configuration.data.contentType = contentTypes.data.find(({ uid }) => uid === collectionId);
    return configuration.data;
  };

  const { data, error } = useSWR(collectionId, fetchConfiguration);
  return {
    data,
    error,
    isLoading: !data && !error,
  };
}

const ShowError = ({ name, error }) => {
  if (!error) return null;
  return (
    <div className="ShowError" style={{ color: 'red' }}>
      <h3>{name}</h3>
      {error.message}
      <pre>{error.stack}</pre>
    </div>
  );
};

export default function DiffPage({ match: { params } }) {
  const { collectionId, entryId, versionId } = params;

  const history = useHistory();

  const { data: config, error: configError } = useConfiguration(collectionId);
  const { data: currentVersion, error: currentVersionError } = useCurrentVersion(collectionId, entryId);
  const { data: selectedVersion, error: selectedVersionError } = useVersion(collectionId, entryId, versionId);
  const [isRestoring, setRestoring] = useState(false);
  const [error, setError] = useState(null);

  const isLoading = (
    !config &&
    !configError &&
    !selectedVersion &&
    !selectedVersionError &&
    !currentVersion &&
    !currentVersionError
  );

  const selected = cleanVersion(selectedVersion, config);
  const current = cleanVersion(currentVersion, config);
  const date = selected && new Date(selected.created_at).toLocaleString();

  const restoreVersion = async () => {
    setRestoring(true);
    try {
      await request(`/content-manager/collection-types/${collectionId}/${entryId}`, { method: 'PUT', body: selected });
      history.push(`/plugins/content-manager/collectionType/${collectionId}/${entryId}`);
    } catch (e) {
      setError(e);
    } finally {
      setRestoring(false);
    }
  };

  const headerMenuActions = [
    {
      label: 'Restore',
      onClick: restoreVersion,
      color: 'success',
      type: 'button',
      disabled: isRestoring,
    },
  ];

  return (
    <>
      <BackHeader onClick={() => history.go(-1)} />
      <Container>
        {error && <ShowError name="Error" error={error} />}
        {selected && current && date && (
          <>
            <Header
              title={{ label: `${collectionName(collectionId)} ${entryId}` }}
              content={`Restore version from ${date}?`}
              isLoading={isLoading}
              actions={headerMenuActions}
            />
            <ShowError name="configError" error={configError} />
            <ShowError name="selectedVersionError" error={selectedVersionError} />
            <ShowError name="currentVersionError" error={currentVersionError} />
            <ReactDiffViewer
              oldValue={getComparisonString(current)}
              newValue={getComparisonString(selected)}
              leftTitle={date}
              splitView={false}
            />
          </>
        )}
      </Container>
    </>
  );
};