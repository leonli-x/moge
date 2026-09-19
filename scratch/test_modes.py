# Test and capture screenshots for Word mode and Sentence mode
import subprocess, time

script_word = """
document.querySelector('[data-mode="word"]').click();
"""

script_sentence = """
document.querySelector('[data-mode="sentence"]').click();
"""

# We can use chrome with remote debugging or a quick tamper in english.js or DOM injection
print("Screenshot capture helper ready")
