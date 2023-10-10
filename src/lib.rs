mod utils;

use regex::Regex;
use serde_json::Value;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
    alert("Hello, devtools!");
}

#[wasm_bindgen]
pub fn prettify(content: String) -> Result<String, JsValue> {
    utils::set_panic_hook();

    let json_content: Value = match serde_json::from_str(content.as_str()) {
        Ok(jc) => jc,
        Err(e) => return Err(JsValue::from(e.to_string())),
    };
    match serde_json::to_string_pretty(&json_content) {
        Ok(s) => Ok(s),
        Err(e) => Err(JsValue::from(e.to_string())),
    }
}

#[wasm_bindgen(getter_with_clone)]
pub struct ExpandedJson {
    pub content: String,
    pub property_name: String,
}

#[wasm_bindgen]
pub fn expand(content: String) -> Result<ExpandedJson, JsValue> {
    utils::set_panic_hook();

    let re = Regex::new(r#"\s*"(?<property>.*)":\s*"(?<string_value>.*)""#).unwrap();
    let Some(caps) = re.captures(content.as_str()) else {
        return Err(JsValue::from("Not a string property."));
    };

    let property_name = &caps["property"];
    let value = str::replace(&caps["string_value"], "\\", "");
    let json_content: Value = match serde_json::from_str(value.as_str()) {
        Ok(jc) => jc,
        Err(e) => return Err(JsValue::from(e.to_string())),
    };

    match serde_json::to_string_pretty(&json_content) {
        Ok(s) => Ok(ExpandedJson {
            property_name: property_name.to_string(),
            content: s.into(),
        }),
        Err(e) => Err(JsValue::from(e.to_string())),
    }
}
