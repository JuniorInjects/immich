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

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  MapTheme? theme;

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
        theme: MapTheme.fromJson(json[r'theme']),
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

