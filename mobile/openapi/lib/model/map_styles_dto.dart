//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.12

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class MapStylesDto {
  /// Returns a new [MapStylesDto] instance.
  MapStylesDto({
    required this.name,
    this.theme,
    required this.url,
  });

  String name;

  MapStylesDtoThemeEnum? theme;

  String url;

  @override
  bool operator ==(Object other) => identical(this, other) || other is MapStylesDto &&
     other.name == name &&
     other.theme == theme &&
     other.url == url;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (name.hashCode) +
    (theme == null ? 0 : theme!.hashCode) +
    (url.hashCode);

  @override
  String toString() => 'MapStylesDto[name=$name, theme=$theme, url=$url]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
      json[r'name'] = this.name;
    if (this.theme != null) {
      json[r'theme'] = this.theme;
    } else {
    //  json[r'theme'] = null;
    }
      json[r'url'] = this.url;
    return json;
  }

  /// Returns a new [MapStylesDto] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static MapStylesDto? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      return MapStylesDto(
        name: mapValueOfType<String>(json, r'name')!,
        theme: MapStylesDtoThemeEnum.fromJson(json[r'theme']),
        url: mapValueOfType<String>(json, r'url')!,
      );
    }
    return null;
  }

  static List<MapStylesDto> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <MapStylesDto>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = MapStylesDto.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, MapStylesDto> mapFromJson(dynamic json) {
    final map = <String, MapStylesDto>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = MapStylesDto.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of MapStylesDto-objects as value to a dart map
  static Map<String, List<MapStylesDto>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<MapStylesDto>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = MapStylesDto.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'name',
    'url',
  };
}


class MapStylesDtoThemeEnum {
  /// Instantiate a new enum with the provided [value].
  const MapStylesDtoThemeEnum._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const light = MapStylesDtoThemeEnum._(r'light');
  static const dark = MapStylesDtoThemeEnum._(r'dark');

  /// List of all possible values in this [enum][MapStylesDtoThemeEnum].
  static const values = <MapStylesDtoThemeEnum>[
    light,
    dark,
  ];

  static MapStylesDtoThemeEnum? fromJson(dynamic value) => MapStylesDtoThemeEnumTypeTransformer().decode(value);

  static List<MapStylesDtoThemeEnum>? listFromJson(dynamic json, {bool growable = false,}) {
    final result = <MapStylesDtoThemeEnum>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = MapStylesDtoThemeEnum.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [MapStylesDtoThemeEnum] to String,
/// and [decode] dynamic data back to [MapStylesDtoThemeEnum].
class MapStylesDtoThemeEnumTypeTransformer {
  factory MapStylesDtoThemeEnumTypeTransformer() => _instance ??= const MapStylesDtoThemeEnumTypeTransformer._();

  const MapStylesDtoThemeEnumTypeTransformer._();

  String encode(MapStylesDtoThemeEnum data) => data.value;

  /// Decodes a [dynamic value][data] to a MapStylesDtoThemeEnum.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  MapStylesDtoThemeEnum? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'light': return MapStylesDtoThemeEnum.light;
        case r'dark': return MapStylesDtoThemeEnum.dark;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [MapStylesDtoThemeEnumTypeTransformer] instance.
  static MapStylesDtoThemeEnumTypeTransformer? _instance;
}


