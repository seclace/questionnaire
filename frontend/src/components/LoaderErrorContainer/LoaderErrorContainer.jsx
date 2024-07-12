import PropTypes from 'prop-types';

export function LoaderErrorContainer({ isLoading, error, children }) {
    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return children;
}

LoaderErrorContainer.propTypes = {
    isLoading: PropTypes.bool,
    error: PropTypes.object,
    children: PropTypes.node,
};
