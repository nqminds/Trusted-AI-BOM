import React, { useState, useEffect } from 'react';
import LazyLoad from 'react-lazyload';
import contributors from '../../contributors.json';
import ContributorAvatar from '../ContributorAvatar';

const Contributors = (props) => {
  const [loading, setLoading] = useState(true);
  const [repoStars, setRepoStars] = useState(0);
  const [repoForks, setRepoForks] = useState(0);
  const [repoWatchers, setRepoWatchers] = useState(0);

  useEffect(() => {
    fetch(`https://api.github.com/repos/nqminds/Trusted-AI-BOM`).then(async (response) => {
      const data = await response.json();

      if (data && data.stargazers_count) {
        setRepoStars(data.stargazers_count);
      }

      if (data && data.forks_count) {
        setRepoForks(data.forks_count);
      }

      if (data && data.watchers_count) {
        setRepoWatchers(data.watchers_count);
      }

      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div></div>;
  }

  const sortedContributors = contributors
    .map((o) => {
      // add one day per commit
      o.score = o.lastContribution + o.total * 86400;
      return o;
    })
    .sort((a, b) => (a.score > b.score ? -1 : 1));

  return (
    <div className="contributors">
      <div className="pluginsHeader">Contributors</div>
      <div>
        {sortedContributors.length > 0 && (
          <LazyLoad height={200}>
            <div>
              {sortedContributors.map((data, i) => (
                <ContributorAvatar key={i} {...data} />
              ))}
            </div>
          </LazyLoad>
        )}
      </div>
      {/* counter */}
      <div className="stats">
        <div className="stats-item">
          <p>{sortedContributors.length} Contributors</p>
        </div>
        <div className="stats-item">
          <p>{repoForks} Forks</p>
        </div>
        <div className="stats-item">
          <p>{repoWatchers} Watchers</p>
        </div>
        <div className="stats-item">
          <p>{repoStars} Stars</p>
        </div>
      </div>
    </div>
  );
};

export default Contributors;
