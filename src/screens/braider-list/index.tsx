import { useDeferredValue, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';

import { useBraiders } from '@/api/queries';
import { QueryErrorView } from '@/components/query-error-view';
import { LoadingView, StateView } from '@/components/state-view';
import { Text } from '@/components/text';
import { useTheme } from '@/hooks/use-theme';
import { BraiderRow } from '@/screens/braider-list/braider-row';
import { SearchField } from '@/screens/braider-list/search-field';
import { MAX_CONTENT_WIDTH, spacing } from '@/theme';
import { searchBraiders } from '@/utils/search-braiders';

export function BraiderListScreen() {
  const { colors } = useTheme();
  const braiders = useBraiders();
  const [query, setQuery] = useState('');
  // Keeps typing responsive if filtering ever becomes expensive (e.g. a larger catalogue).
  const deferredQuery = useDeferredValue(query);

  // Data first: a failed background refetch keeps showing what we already have.
  if (braiders.data === undefined) {
    return braiders.isError ? (
      <QueryErrorView error={braiders.error} title="Couldn’t load braiders" onRetry={() => braiders.refetch()} />
    ) : (
      <LoadingView label="Loading braiders" />
    );
  }

  const results = searchBraiders(braiders.data, deferredQuery);
  const trimmedQuery = deferredQuery.trim();

  return (
    <FlatList
      data={results}
      keyExtractor={(braider) => braider.id}
      renderItem={({ item }) => <BraiderRow braider={item} />}
      contentInsetAdjustmentBehavior="automatic"
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.content}
      ItemSeparatorComponent={Separator}
      refreshControl={
        <RefreshControl
          refreshing={braiders.isRefetching}
          onRefresh={() => void braiders.refetch()}
          tintColor={colors.primary}
          colors={[colors.primary]}
        />
      }
      ListHeaderComponent={
        <View style={styles.header}>
          <Text variant="subhead" color="textSecondary">
            Book a trusted braider near you in a few taps.
          </Text>
          <SearchField value={query} onChangeText={setQuery} />
          {trimmedQuery && results.length > 0 ? (
            <Text variant="footnote" color="textSecondary" accessibilityLiveRegion="polite">
              {results.length} {results.length === 1 ? 'result' : 'results'} for “{trimmedQuery}”
            </Text>
          ) : null}
        </View>
      }
      ListEmptyComponent={
        trimmedQuery ? (
          <StateView
            title="No braiders found"
            message={`Nobody matches “${trimmedQuery}”. Try another name or style, like “box braids” or “twists”.`}
            action={{ label: 'Clear search', onPress: () => setQuery('') }}
          />
        ) : (
          <StateView title="No braiders yet" message="Check back soon — new braiders join every week." />
        )
      }
    />
  );
}

function Separator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  content: {
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: 'center',
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
    flexGrow: 1,
  },
  header: { gap: spacing.md, marginBottom: spacing.lg },
  separator: { height: spacing.md },
});
